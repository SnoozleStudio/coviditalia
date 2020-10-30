const api_urlIt = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';

// draw a simple x y line graph
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

// tronca la data array 
function truncateDate(arrayIn, arrayOut, ) {
  const arrayInCopy = [...arrayIn];
  arrayInCopy.forEach(dataUnit => {
    arrayOut.push(dataUnit.split("T")[0]);
  })
}

function roundOff(num, places) {
  const x = Math.pow(10, places);
  return Math.round(num * x) / x;
}

async function getCovidIt() {
  // get data
  const response = await fetch(api_urlIt);
  const data = await response.json();

  console.log(data);

  // get all days in array
  let giorniExt = _.map(data, 'data');
  let giorni = [];

  truncateDate(giorniExt, giorni);

  function getLastOfArray(el, arg) {
    let container = document.getElementById(el);
    let array = _.map(data, arg);
    let last = array.pop();
    container.innerText = last;
  }

  getLastOfArray('js-totale-casi', 'totale_casi');
  getLastOfArray('js-totale-positivi', 'totale_positivi');
  getLastOfArray('js-deceduti', 'deceduti');
  getLastOfArray('js-dimessi-guariti', 'dimessi_guariti');
  getLastOfArray('js-ricoverati-con-sintomi', 'ricoverati_con_sintomi');
  getLastOfArray('js-terapia-intensiva', 'terapia_intensiva');
  getLastOfArray('js-isolamento-domiciliare', 'isolamento_domiciliare');

  let itRed = '#CD212A';
  let bluSavoia = '#4B61D1';
  let itGreen = '#008C45';

  function getLastDayVariationBgUp(elAbs, elRel, arg, cont) {
    let containerAbs = document.getElementById(elAbs);
    let containerRel = document.getElementById(elRel);
    let container = document.getElementById(cont);
    let array = _.map(data, arg);
    let last = array.pop();
    let secondLast = array.pop();
    let val = last - secondLast;
    let relVal = ((last - secondLast) / last) * 100;
    if (val > 0) {
      containerAbs.innerText = '+' + (last - secondLast);
      if (arg != 'dimessi_guariti') {
        container.style.backgroundColor = itRed;
      } else {
        container.style.backgroundColor = itGreen;
      }
    } else if (val == 0) {
      container.style.backgroundColor = bluSavoia;
    } else {
      containerAbs.innerText = last - secondLast;
      if (arg != 'dimessi_guariti') {
        container.style.backgroundColor = itGreen;
      } else {
        container.style.backgroundColor = itRed;
      }
    }
    containerRel.innerText = '(' + roundOff(relVal, 1) + '%)';
  }

  getLastDayVariationBgUp('js-ricoverati-con-sintomi-absolute', 'js-ricoverati-con-sintomi-relative', 'ricoverati_con_sintomi', 'js-ricoverati-con-sintomi-container');
  getLastDayVariationBgUp('js-terapia-intensiva-absolute', 'js-terapia-intensiva-relative', 'terapia_intensiva', 'js-terapia-intensiva-container');
  getLastDayVariationBgUp('js-isolamento-domiciliare-absolute', 'js-isolamento-domiciliare-relative', 'isolamento_domiciliare', 'js-isolamento-domiciliare-container');
  getLastDayVariationBgUp('js-totale-positivi-absolute', 'js-totale-positivi-relative', 'totale_positivi', 'js-totale-positivi-container');
  getLastDayVariationBgUp('js-deceduti-absolute', 'js-deceduti-relative', 'deceduti', 'js-deceduti-container');
  getLastDayVariationBgUp('js-totale-casi-absolute', 'js-totale-casi-relative', 'totale_casi', 'js-totale-casi-container');




  getLastDayVariationBgUp('js-dimessi-guariti-absolute', 'js-dimessi-guariti-relative', 'dimessi_guariti', 'js-dimessi-guariti-container');



  function getLastUpdateTime(elDate, elTime, arg) {
    let containerDate = document.getElementById(elDate);
    let containerTime = document.getElementById(elTime);
    let array = _.map(data, arg);
    let last = array.pop();
    let getDate = last.split("T")[0];
    console.log(getDate);
    let getTime = last.split("T")[1];
    console.log(getTime);
    containerDate.innerText = getDate;
    containerTime.innerText = getTime;
  }

  getLastUpdateTime('js-last-update-date', 'js-last-update-time', 'data');

  // get all variazione positivi
  let variazioneTotalePositivi = _.map(data, 'nuovi_positivi');

  grafico(giorni, variazioneTotalePositivi, 'line', 'itChart');
}

getCovidIt();