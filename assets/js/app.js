const api_urlIt = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';

function grafico(x, y, type, elem) {
  let timeStep = [...x].length / 56;

  const ctx = document.getElementById(elem).getContext('2d');
  const ctxOptions = {
    type: type,
    data: {
      labels: x,
      datasets: [{
        // label: '# of Votes',
        data: y,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            drawBorder: false,
            display: false
          },
          ticks: {
            maxRotation: 90,
            minRotation: 90,
            maxTicksLimit: timeStep
          }
        }],
        yAxes: [{
          gridLines: {
            drawBorder: false,
          },
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5
          }
        }]
      }
    }
  }

  let myChart = new Chart(ctx, ctxOptions);
}

async function getCovidIt() {
  // get data
  const response = await fetch(api_urlIt);
  const data = await response.json();

  // check data
  // console.log(data);

  // get all days in array
  let giorniExt = _.map(data, 'data');
  let giorni = [];
  // console.log(giorniExt);

  // tronca la data array
  function truncateDate(arrayIn, arrayOut, ) {
    const arrayInCopy = [...arrayIn];
    arrayInCopy.forEach(dataUnit => {
      arrayOut.push(dataUnit.split("T")[0]);
    })
  }
  truncateDate(giorniExt, giorni);

  function mainTableData(el, arg) {
    let container = document.getElementById(el);
    let array = _.map(data, arg);
    // console.log(array);
    let last = array.pop();
    container.innerText = last;
    // console.log(last);
    // console.log(array);
  }

  mainTableData('js-totale-casi', 'totale_casi');
  mainTableData('js-totale-positivi', 'totale_positivi');
  mainTableData('js-deceduti', 'deceduti');
  mainTableData('js-dimessi-guariti', 'dimessi_guariti');

  // get all variazione positivi
  let variazioneTotalePositivi = _.map(data, 'nuovi_positivi');
  // console.log(variazioneTotalePositivi);

  grafico(giorni, variazioneTotalePositivi, 'line', 'itChart');
}

getCovidIt();