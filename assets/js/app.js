const api_urlIt = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';

function grafico(x, y, type, elem) {
  let timeStep = [...x].length / 56;

  const ctx = document.getElementById(elem).getContext('2d');
  let myChart = new Chart(ctx, {
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
  });
}

async function getCovidIt() {
  // get data
  const response = await fetch(api_urlIt);
  const data = await response.json();

  // check data
  console.log(data);

  // get all days in array
  let giorniExt = _.map(data, 'data');
  let giorni = [];
  console.log(giorniExt);

  // tronca la data array
  function truncateDate(arrayIn, arrayOut, ) {
    const arrayInCopy = [...arrayIn];
    arrayInCopy.forEach(dataUnit => {
      arrayOut.push(dataUnit.split("T")[0]);
    })
  }
  truncateDate(giorniExt, giorni);

  // totale casi
  let totaleCasiContainer = document.getElementById('js-totale-casi');
  let totaleCasi = _.map(data, 'totale_casi');
  let totaleCasiLast = totaleCasi.pop();
  totaleCasiContainer.innerText = totaleCasiLast;

  // totale positivi
  let totalePositiviContainer = document.getElementById('js-totale-positivi');
  let totalePositivi = _.map(data, 'totale_positivi');
  let totalePositiviLast = totalePositivi.pop();
  totalePositiviContainer.innerText = totalePositiviLast;

  // deceduti
  let decedutiContainer = document.getElementById('js-deceduti');
  let deceduti = _.map(data, 'deceduti');
  let decedutiLast = deceduti.pop();
  decedutiContainer.innerText = decedutiLast;

  // dimessi guariti
  let dimessiGuaritiContainer = document.getElementById('js-dimessi-guariti');
  let dimessiGuariti = _.map(data, 'dimessi_guariti');
  let dimessiGuaritiLast = dimessiGuariti.pop();
  dimessiGuaritiContainer.innerText = dimessiGuaritiLast;

  // get all variazione positivi
  let variazioneTotalePositivi = _.map(data, 'nuovi_positivi');
  console.log(variazioneTotalePositivi);

  grafico(giorni, variazioneTotalePositivi, 'line', 'itChart');
}

getCovidIt();