window.onload = onLoad;
var chart;
var chartData;

var titleChart;
var month = [
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December']
var myArr;
function onLoad(){
  //Initializing Chart
  titleChart = "Test";
  newChart(titleChart);

  //Gather default information for graph or table
  setPreset(-20);
  applyWeatherFilter(30);
}

function setPreset(days) {
tempDate = new Date();
document.getElementById("inp_fromDate").value = formatDate(tempDate.setDate(tempDate.getDate() + days));
document.getElementById("inp_toDate").value = formatDate(new Date(),0);
applyWeatherFilter();
}

function formatDate(date,days) {
  var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');

}



function newChart(label){

  var ctx = document.getElementById('chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
        datasets: [{
          pointRadius:0,
          pointHoverRadius:10,
          pointHitRadius:10,
          pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
            label: label,
            //backgroundColor: 'rgb(255, 99, 132)',
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            //data: [],
            //pointHitRadius: 20 //Distance from hoverpoint
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {autoSkip: false}
            }]
        },
        tooltips: {
          mode: 'index',

          intersect: false,
          callbacks: {
            label: (tooltipItem, data) => {

                return ["Time: "+myArr[myArr.length-1-tooltipItem.index].measureTime,myArr[tooltipItem.index].temperatureAvg, 'Item 2', 'Item 3'];

            }
          },
          tooltips: {
            mode: 'index',
            intersect: false
          }
  }
    }

  });

}




function addData(chart, bodyContent, data) {



  //Add data to chart
  if(radio_chart.checked){
    var previousDate = new Date('December 17, 1995 03:24:00');
    var newDate = new Date();
    var currentMonth =22434;
    for(var x = data.length - 1; x > 0;x--){
      newDate = new Date(data[x][bodyContent[0]]);

          //Creating labels
          //if(previousDate.getMonth() != newDate.getMonth() ){


            if(newDate.getMonth() != currentMonth) {
              currentMonth = newDate.getMonth();
              console.log(newDate.getMonth());
              chart.data.labels.push(month[newDate.getMonth()]);
            } else {
              chart.data.labels.push("");
            }


            previousDate = new Date(data[x][bodyContent[0]]);
          //}


          //Adding data
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data[x][bodyContent[1]]);

        });

    }
    document.getElementById('chart').style.display = "";
    document.getElementById('table').style.display = "none";



  }

  else if(radio_table.checked){
    document.getElementById('chart').style.display = "none";
    document.getElementById('table').style.display = "";
    var tbody = document.getElementById('tbody');

    for(var x = 0; x < data.length;x++) {
       tr = document.createElement("tr");
    //Add data to table
      for(var i = 0; i < bodyContent.length;i++) {
        th1 = document.createElement("th");
        th1.innerHTML = data[x][bodyContent[i]];
        tr.appendChild(th1);
      }
    tbody.appendChild(tr);
  }
  }
}

function addData2(chart, bodyContent, data){

  chartData = [];
  chartRow = [];
  lowest = 10000;
  highest = -1000;
  for(var x = 0; x < data.length;x++) {
    if(data[x][bodyContent[2]] < lowest) {
      lowest = data[x][bodyContent[2]];
    }

    if(data[x][bodyContent[3]] > highest) {
      highest = data[x][bodyContent[3]];
    }
    console.log(bodyContent);
    var chartRow = {
      "date": data[x][bodyContent[0]],
      "value1": data[x][bodyContent[3]],
      "value2": data[x][bodyContent[1]],
      "value3": data[x][bodyContent[2]],
      "value4": data[x][bodyContent[4]],
      "wind": "https://s3-us-west-2.amazonaws.com/s.cdpn.io/218423/wind-dart-black-1.png",
      "base": 1
    };
    //    bodyContent = ['measureTime', 'windspeedAvg', 'windspeedMin', 'windspeedMax', 'windDirection', 'windspeedMinTime', 'windspeedTimeMax'];

    chartData.push(chartRow);
  }

  chart_wind["dataProvider"] = chartData;
  drawChart(chart_wind);
}









function applyWeatherFilter(){
    //Display loadingScreen
  document.getElementById('loadingData').style.display = 'block';

    //Reading filter value
  var weatherData = document.getElementById("weatherDataText");
  var inp_fromDate = document.getElementById("inp_fromDate").value;
  var inp_toDate = document.getElementById("inp_toDate").value;

  var xmlhttp = new XMLHttpRequest();
  var url;

    //If not enough filter values it defaults to this data
  if(inp_fromDate == "" || inp_toDate == ""){
    url = "weatherData.php?fromDate=2017-06-20&toDate=2017-09-01&stationId=1";
    }

    //Applying filter values to
  else{
    url = "weatherData.php?fromDate="+ inp_fromDate + "&toDate="+inp_toDate+"&stationId=1";
  }
  if(radio_realTime.checked) {
    url = 'weatherDataRealTime.php?fromDate='+ inp_fromDate + "&toDate="+inp_toDate+"&stationId=1";
  }
  console.log(url);
    //Requesting data with filter values specified above
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
         myArr = JSON.parse(this.responseText);

        //Remove LoadingScreen when the data has been acquired
      document.getElementById('loadingData').style.display = 'none';
    }
  };
}

  //Function for setting new values to the table header.


function display(array){
  var headerContent;
  var bodyContent
    //Removing previous loaded data
  chart.destroy();
  newChart(titleChart);
    //Removing table content
  document.getElementById("tbody").innerHTML = '';


  if(radio_temperature.checked){
    //Defining the coulumns in the table header
    headerContent = ["Date", "Average temperature","Minimum temperature","Maximum temperature","Minimum Temperature Time", "Maximum temperature time"];
    bodyContent = ["measureTime", "temperatureAvg","temperatureMin","temperatureMax","temperatureMinTime","temperatureMaxTime"];
  }

  if(radio_humidity.checked){

    headerContent = ["Date", "Average humidity", 'Minimum humidity', 'Maximum humidity', 'humidityMinTime', 'humitityMaxTime'];
    bodyContent = ["measureTime", 'humidityAvg', 'humidityMin', 'humidityMax', 'humidityMinTime', 'humitityMaxTime'];
  }

  if(radio_wind.checked){
    headerContent = ["Date", "Average wind speed", 'Minimum wind speed', 'Maximum wind speed', 'Wind direction', 'windspeedMinTime', 'windspeedTimeMax'];
    bodyContent = ['measureTime', 'windspeedAvg', 'windspeedMin', 'windspeedMax', 'windDirection', 'windspeedMinTime', 'windspeedTimeMax'];
    //chart = chart_wind;
  }

  if(radio_airPressure.checked){
    headerContent = ["Date", "Average pressure", 'Minimum pressure', 'Maximum pressure', 'pressureMinTime', 'pressureMaxTime'];
    bodyContent = ['measureTime','pressureAvg','pressureMin','pressureMax','pressureMinTime','pressureMaxTime'];
  }

  if(radio_realTime.checked){
    headerContent = ["Time", "Wind Speed: m/s", "Wind direction", "Temperature","Humidity", "Pressure"];
    bodyContent = ["mesure_time", "wind_speed", "wind_direction", "temperature","humidity", "pressure"];
  }


  //addData(chart, bodyContent, array);
  addData2(chart, bodyContent, array);

  //Updating chart values
  if(radio_chart.checked){
    createChart();
  } else {
    createTable();
  }


}

function createTable(headerContent,bodyContent) {
  document.getElementById("chartdiv").style.display = 'none';
  createTableHeader(headerContent);
  createTableBody();

}

function createChart(headerContent,bodyContent) {
  document.getElementById("table").style.display = 'none';


}


function createTableHeader(headerContent){
  var tableHead = document.getElementById('theady');
    //Deleting previous table header elements
  while (tableHead.firstChild) {
    tableHead.removeChild(tableHead.firstChild);
  }
    //Creating the header row
  var tr = document.createElement('tr');
    //Creating coulumns for the header row
  for (i = 0; i < headerContent.length; i++) {
    var th = document.createElement('th');
    th.innerHTML = headerContent[i];
    tr.appendChild(th);
  }
  tableHead.appendChild(tr);
}


































var chart_wind = {
  "type": "serial",
  "theme": "light",
  "dataDateFormat": "YYYY-MM-DD",
  "zoomOutText": "",
  "fontSize": 15,
  "color": "#888",
  "valueAxes": [ {
    "id": "v1",
    "axisAlpha": 0,
    "position": "right",
    "inside": true,
    "minimum": 0,
    "maximum": 40,
    "fontSize": 15,
    "color": "#555"
  } ],
  "balloon": {
    "borderThickness": 1,
    "shadowAlpha": 0
  },
  "graphs": [ {
    "id": "g1",
    "lineThickness": 2,
    "lineColor": "#000000",
    "lineAlpha": 0.5,
    "dashLength": 5,
    "valueField": "value1",

    "balloonText": "<div style='margin:5px; font-size:19px;'>[<span style='font-size:17px; text-decoration: underline;'>"+
    "[[category]]</span>]<br />"+
    "Highest Wind Speed: [[value1]] m/s <br /><br />"+
    "Lowest Wind Speed: [[value3]] m/s <br /><br />"+
    "Average Wind Speed: [[value2]] m/s <br /><br /> Wind Direction: [[value4]]°</div>",

    "labelText": "[[value]]",
    "labelPosition": "top",
    "labelOffset": 5,
    "fillToGraph": "g2",
    "fillColors": ["#fdd706", "#c3fcf6"],
    "fillAlphas": 0.5
  }, {
    "id": "g2",
    "lineThickness": 2,
    "lineColor": "#000000",
    "lineAlpha": 0.8,
    "valueField": "value2",
    "showBalloon": false,
    "labelText": "[[value]]",
    "labelPosition": "bottom",
    "labelOffset": 5
  }, {
    "id": "g3",
    "lineAlpha": 0,
    "valueField": "base",
    "customBulletField": "wind",
    "bulletSize": 15,
    "bulletOffset": 10,
    "showBalloon": false
  }, {
    "id": "g4",
    "lineAlpha": 0,
    "fillAlphas": 0.5,
    "fillColors": ["#95faf6", "#01fe03", "#fced00", "#fe312c", "#ff149a"],
    "valueField": "base2",
    "type": "column",
    "showBalloon": false,
    "fixedColumnWidth": 80
  } ],
  "chartScrollbar": {
    "graph": "g1",
    "oppositeAxis": true,
    "scrollbarHeight": 50,
    "backgroundAlpha": 0,
    "selectedBackgroundAlpha": 0.1,
    "selectedBackgroundColor": "#888888",
    "graphFillAlpha": 0,
    "graphLineAlpha": 0.5,
    "selectedGraphFillAlpha": 0,
    "selectedGraphLineAlpha": 1,
    "autoGridCount": false,
    "color": "#AAAAAA"
  },
  "chartCursor": {
    "pan": true,
    "valueLineEnabled": true,
    "valueLineBalloonEnabled": true,
    "cursorAlpha": 0,
    "valueLineAlpha": 0.2,
    "categoryBalloonDateFormat": "HH:NN"
  },
  "categoryField": "date",
  "categoryAxis": {
    "parseDates": true,
    "minPeriod": "hh",
    "position": "top",
    "inside": true,
    "color": "#888",
    "fontSize": 15,
    "dashLength": 5,
    "equalSpacing": true,
    "startOnAxis": true,
    "guides": [{
      "date": new Date(2012, 6, 26, 21, 30),
      "toDate": new Date(2012, 6, 27, 7, 28),
      "fillAlpha": 0.05
    }, {
      "date": new Date(2012, 6, 27, 21, 30),
      "toDate": new Date(2012, 6, 28, 7, 28),
      "fillAlpha": 0.05
    }]
  },
  "dataProvider": chartData
}

function drawChart(chartType){
  var chart = AmCharts.makeChart( "chartdiv", chartType );
}



chart.addListener( "rendered", zoomChart );

zoomChart();

function zoomChart() {
  chart.zoomToIndexes( chart.dataProvider.length - 24, chart.dataProvider.length - 1 );
}
