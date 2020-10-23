const api_urlIt = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';

function grafico(x, y, type, elem) {
  let timeStep = [...x].length / 56;
  
  var ctx = document.getElementById(elem).getContext('2d');
  var myChart = new Chart(ctx, {
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
            maxRotation: 0,
            minRotation: 0,
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
  let giorni = _.map(data, 'data');
  console.log(giorni);

  // get all variazione positivi
  let variazioneTotalePositivi = _.map(data, 'nuovi_positivi');
  console.log(variazioneTotalePositivi);

  grafico(giorni, variazioneTotalePositivi, 'line', 'itChart');
}

getCovidIt();