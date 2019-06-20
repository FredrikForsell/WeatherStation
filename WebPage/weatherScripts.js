window.onload = onLoad;
var chart;
var chartData = [];
var myArr;
var  headerContent;
var titleChart;
var unit = "";
var type = "";
var chartOptions = {};
function onLoad(){
  //Initializing Chart
  titleChart = "Test";


  //Gather default information for graph or table
  setPreset(-20);

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


function prepareChartData(bodyContent,types,realtime){
setChartOptions();
  chartData = [];
  chartRow = [];
  lowest = 10000;
  highest = -1000;
  console.log(bodyContent);
  console.log(myArr.length);
  for(var x = myArr.length-1; x >= 0;x--) {

    if(myArr[x][bodyContent[2]] < lowest) {
      lowest = myArr[x][bodyContent[2]];
    }

    if(myArr[x][bodyContent[3]] > highest) {
      highest = myArr[x][bodyContent[3]];
    }
    //bodyContent = ["measureTime", "temperatureAvg","temperatureMin","temperatureMax","temperatureMinTime","temperatureMaxTime"];
    //bodyContent = ['measureTime', 'windspeedAvg', 'windspeedMin', 'windspeedMax', 'windDirection', 'windspeedMinTime', 'windspeedTimeMax'];
    //bodyContent = ["measureTime", 'humidityAvg', 'humidityMin', 'humidityMax', 'humidityMinTime', 'humitityMaxTime'];


    if(radio_wind.checked) {
      var chartRow = {
        "types":types,
        "date": myArr[x][bodyContent[0]],
        "value1": myArr[x][bodyContent[3]],
        "value2": myArr[x][bodyContent[2]],
        "avgValue":myArr[x][bodyContent[1]]+unit,
        "minValue":myArr[x][bodyContent[2]]+unit,
        "minTime": myArr[x][bodyContent[4]],
        "maxValue":myArr[x][bodyContent[3]]+unit,
        "maxTime": myArr[x][bodyContent[5]],
        "windDirection":"</br>Average wind direction:"+myArr[x][bodyContent[6]]+'°',
        "base": 1
      };
    }
    else if(radio_realTime.checked){
      types ="Real time";
      headerContent = ["Time", "Wind Speed: m/s", "Wind direction", "Temperature","Humidity", "Pressure"];
      bodyContent = ["mesure_time", "wind_speed", "wind_direction", "temperature","humidity", "pressure"];
      var chartRow = {
        "types":types,
        "date": myArr[x][bodyContent[0]],
        "value1": myArr[x][bodyContent[3]],
        "value2": myArr[x][bodyContent[2]],
        "avgValue":myArr[x][bodyContent[1]]+unit,
        "minValue":myArr[x][bodyContent[2]]+unit,
        "minTime": myArr[x][bodyContent[4]],
        "maxValue":myArr[x][bodyContent[3]]+unit,
        "maxTime": myArr[x][bodyContent[5]],
        "windDirection":"</br>Average wind direction:"+myArr[x][bodyContent[6]]+'°',
        "base": 1
      };
    } else {
    var chartRow = {
      "types":types,
      "date": myArr[x][bodyContent[0]],
      "value1": myArr[x][bodyContent[3]],
      "value2": myArr[x][bodyContent[2]],
      "avgValue":myArr[x][bodyContent[1]]+unit,
      "minValue":myArr[x][bodyContent[2]]+unit,
      "minTime": myArr[x][bodyContent[4]],
      "maxValue":myArr[x][bodyContent[3]]+unit,
      "maxTime": myArr[x][bodyContent[5]],
      "windDirection":"",
      "base": 1
    };
  }
    //bodyContent = ['measureTime', 'windspeedAvg', 'windspeedMin', 'windspeedMax', 'windDirection', 'windspeedMinTime', 'windspeedTimeMax'];

    chartData.push(chartRow);
  }

  chartOptions["valueAxes"][0]["unit"] = unit;
  if(radio_wind.checked) {
    chartOptions["valueAxes"][0]["minimum"] = 0;
    chartOptions["valueAxes"][0]["maximum"] = highest+2;
  } else if(radio_humidity.checked) {
    chartOptions["valueAxes"][0]["minimum"] = 0;
    chartOptions["valueAxes"][0]["maximum"] = 100;
  }else if(radio_temperature.checked){
    chartOptions["valueAxes"][0]["minimum"] =lowest-5;
    chartOptions["valueAxes"][0]["maximum"] =highest+5;
  } else{
    chartOptions["valueAxes"][0]["minimum"] = lowest-5;
    chartOptions["valueAxes"][0]["maximum"] = highest+2;
  }

  console.log(chartOptions);
  chartOptions["dataProvider"] = chartData;
  console.log(chartData);

}

function display(){
  // Hide minute value charts
  document.getElementById("realTimeCharts").style.display = 'none';


  var headerContent;
  var bodyContent
document.getElementById("chartdiv").innerHTML = '';
    //Removing table content
  document.getElementById("tbody").innerHTML = '';
  var title = document.getElementById("tableTitle");
  realtime = [];
  if(radio_temperature.checked){
    //Defining the coulumns in the table header
    headerContent = ["Date", "Average temperature","Minimum temperature","Maximum temperature","Minimum Temperature Time", "Maximum temperature time"];
    bodyContent = ["measureTime", "temperatureAvg","temperatureMin","temperatureMax","temperatureMinTime","temperatureMaxTime"];
    unit = "°C";
    types ="Temperature";
    title.innerHTML =types + " given in " + unit;
  }

  if(radio_humidity.checked){

    headerContent = ["Date", "Average humidity", 'Minimum humidity', 'Maximum humidity', 'humidityMinTime', 'humitityMaxTime'];
    bodyContent = ["measureTime", 'humidityAvg', 'humidityMin', 'humidityMax', 'humidityMinTime', 'humitityMaxTime'];
    unit="%";
    types ="Humidity";
    title.innerHTML =types + " given in " + unit;
  }

  if(radio_wind.checked){
    headerContent = ["Date", "Average wind speed", 'Minimum speed', 'Maximum speed', 'Max time', 'Min time', 'Wind direction'];
    bodyContent = ['measureTime', 'windspeedAvg', 'windspeedMin', 'windspeedMax', 'windspeedMinTime', 'windspeedTimeMax','windDirection'];
    unit="m/s";
    types ="Wind";
    title.innerHTML =types + " given in " + unit;
    //chart = chart_wind;
  }

  if(radio_airPressure.checked){
    types ="Pressure";
    headerContent = ["Date", "Average pressure", 'Minimum pressure', 'Maximum pressure', 'pressureMinTime', 'pressureMaxTime'];
    bodyContent = ['measureTime','pressureAvg','pressureMin','pressureMax','pressureMinTime','pressureMaxTime'];
    unit="hPa";
    title.innerHTML =types + " given in " + unit;
  }

  if(radio_realTime.checked){
    document.getElementById("realTimeCharts").style.display = '';
    types ="Minute values";
    headerContent = ["Time", "Wind Speed: m/s", "Wind direction °", "Temperature °C","Humidity %", "Pressure hPa"];
    bodyContent = ["mesure_time", "wind_speed", "wind_direction", "temperature","humidity", "pressure"];
    title.innerHTML =types;
    radio_chart.checked = false;
    radio_table.checked = true;
    setChartOptionsRealtimeData(myArr,"wind_speed","chartWind","m/s",true);
    setChartOptionsRealtimeData(myArr,"temperature","chartTemperature","°C",false);
    setChartOptionsRealtimeData(myArr,"pressure","chartPressure","hPa",false);
    setChartOptionsRealtimeData(myArr,"humidity","chartHumidity","%",false);




  }

  createTableHeader(headerContent,types,realtime);
  //addData(chart, bodyContent, array);
console.log(headerContent);

  //Updating chart values
if(radio_chart.checked){
createChart(bodyContent,types,realtime)
  } else {
createTable(bodyContent);
  }


}

function createChart(headerContent,types,realtime) {
document.getElementById("chartdiv").style.display = '';
document.getElementById("table").style.display = 'none'
prepareChartData(headerContent,types,realtime);

chart = AmCharts.makeChart("chartdiv", chartOptions);

}

function createTable(bodyContent) {
  document.getElementById("chartdiv").style.display = 'none';
  document.getElementById("table").style.display = '';
  tbody = document.getElementById("tbody");
  tbody.innerHTML ='';
  for(var i =0;i < myArr.length; i++){
    row = document.createElement("tr")
    for(var x =0;x < bodyContent.length; x++) {
      element = document.createElement("td");
      element.innerHTML = myArr[i][bodyContent[x]];
      row.appendChild(element);
    }
    tbody.appendChild(row);
  }

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
    console.log('hei');
  }
    //Appending the row to the table header
  tableHead.appendChild(tr);
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

  // Find selected station
  var station1 = document.getElementById("station1");
  var station2 = document.getElementById("station2");
  // if checked:
  if(station1.checked) {
    stationId=1;
  } else if(station2.checked) {
    stationId=2;
  } else {
    return;
  }

    //If not enough filter values it defaults to this data
  if(inp_fromDate == "" || inp_toDate == ""){
    url = "weatherData.php?fromDate=2017-06-20&toDate=2017-09-01&stationId=1";
    }

    //Applying filter values to
  else{
    url = "weatherData.php?fromDate="+ inp_fromDate + "&toDate="+inp_toDate+"&stationId="+stationId;
  }
  if(radio_realTime.checked) {
    url = 'weatherDataRealTime.php?fromDate='+ inp_fromDate + "&toDate="+inp_toDate+"&stationId="+stationId;
  }
  console.log(url);
    //Requesting data with filter values specified above
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

         myArr = JSON.parse(this.responseText);
         if(myArr.length == 0) {
           alert("No weather data recorded for this timeframe.")
         }
         display();

        //Remove LoadingScreen when the data has been acquired
      document.getElementById('loadingData').style.display = 'none';
    }
  };
}



//var chart = AmCharts.makeChart( "chartdiv", chartOptions);
function setChartOptions() {
chartOptions = {
  "type": "serial",
  "theme": "light",
  "dataDateFormat": "YYYY-MM-DD JJ:NN:SS",
  "zoomOutText": "",
  "fontSize": 15,
  "connect": false,
  "color": "#888",
  "valueAxes": [ {
    "id": "v1",
    "axisAlpha": 0,
    "position": "right",
    "inside": true,
    //"minimum": 0,
    //"maximum": 20,
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
    "balloonText": "<div style='text-align:left;width:250px;margin:10px; font-size:17px;'><span style='font-size:16px; text-decoration: underline;'>[[types]] - [[category]]</span><br />Average: [[avgValue]]</br>Minumum: [[minValue]]</br>([[minTime]])</br> Maximum: [[maxValue]]</br>([[maxTime]])[[windDirection]]</div>",
    "labelText": "",
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
    "labelText": "",
    "labelPosition": "bottom",
    "labelOffset": 5
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

  },
  "dataProvider": []
}
}

function setChartOptionsRealtimeData(data,index,div,unit,wind) {
var dataArr = [];
console.log(data);
if(wind == false) {
for(var i = data.length-1; i >= 0;i--) {
  dataArr.push({"value1":data[i][index],"date":data[i]["mesure_time"],"unit":unit});
}
} else {
  for(var i = data.length-1; i >= 0;i--) {
    dataArr.push({"value1":data[i][index],"date":data[i]["mesure_time"],"unit":unit,"windDirection":"Direction: "+data[i]["wind_direction"]+"°"});
  }
}


chartOptionsRealtime = {
  "type": "serial",
  "theme": "light",
  "dataDateFormat": "YYYY-MM-DD JJ:NN:SS",
  "zoomOutText": "",
  "fontSize": 15,
  "connect": false,
  "color": "#888",
  "valueAxes": [ {
    "id": "v1",
    "axisAlpha": 0,
    "position": "right",
    "inside": true,
    //"minimum": 0,
    //"maximum": 20,
    "fontSize": 15,
    "color": "#555"
  } ],
  "balloon": {
    "borderThickness": 1,
    "shadowAlpha": 0
  },
  "graphs": [ {
    "id": "g1",
    "lineThickness": 3,
    "lineColor": "#000000",
    "lineAlpha": 0.5,
    "valueField": "value1",
    "balloonText": "<div style='text-align:left;width:500px;margin:2px; font-size:1.2rem;'><span style='font-size:1.2rem; text-decoration: underline;'>[[date]]</span></br>Value: [[value1]][[unit]] </br>[[windDirection]]</div>",
    "labelText": "",
    "labelPosition": "top",
    "labelOffset": 5
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
    "minPeriod": "mm",
    "position": "top",
    "inside": true,
    "color": "#888",
    "fontSize": 15,
    "dashLength": 5,
    "equalSpacing": true,
    "startOnAxis": true,

  },
  "dataProvider": dataArr
}
chartOptionsRealtime["valueAxes"][0]["unit"] = unit;

AmCharts.makeChart(div, chartOptionsRealtime);
}
//chart.addListener( "rendered", zoomChart );



function zoomChart() {
  chart.zoomToIndexes( chart.dataProvider.length - 24, chart.dataProvider.length - 1 );
}
