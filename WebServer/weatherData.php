<?php
// Enter details for database
$mysqli = new mysqli(INSERT);
//Example for request: weatherData.php?fromDate=2014-06-01+00:02:00&toDate=2014-06-01+02:02:00&stationId=1&dayOnly=1

//Get parameters specified by user
$fromDate = $_GET["fromDate"];
$toDate = $_GET["toDate"] . " 23:59:59";
$stationId = $_GET["stationId"];

//Replace + with space. Result string will be in the format "yyyy-mm-dd hh:MM:ss"

If($dayOnly == 1) {
$string = ' AND logId.datetime like "%00:00:00"';
} else {
$string = '';
}


// Prepare sql statement
$stmt = $mysqli->prepare("SELECT
datetime as measureTime, ROUND(temperatureAvg,2) as temperatureAvg, ROUND(temperatureMin,2) as temperatureMin, ROUND(temperatureMax,2) as temperatureMax, temperature.timeMin as temperatureMinTime, temperature.timeMin as temperatureMaxTime,
ROUND(humidityAvg,2) as humidityAvg, ROUND(humidityMin,2) as humidityMin, ROUND(humidityMax,2) as humidityMax, humidity.timeMin as humidityMinTime, humidity.timeMax as humitityMaxTime, ROUND(pressureAvg,2) as pressureAvg,
ROUND(pressureAvg,2) as pressureAvg, ROUND(pressureMin,2) as pressureMin, ROUND(pressureMax,2) as pressureMax, pressure.timeMin as pressureMinTime, pressure.timeMax as pressureMaxTime,
ROUND(windspeedAvg,2) as windspeedAvg, ROUND(windspeedMin,2) as windspeedMin,stationId,ROUND(windspeedMax,2) as windspeedMax,ROUND(winddirectionMax,2) as windDirection,wind.timeMin as windspeedMinTime, wind.timeMax as windspeedTimeMax
FROM logId
INNER JOIN temperature ON logId.id = temperature.logId_id
INNER JOIN humidity ON logId.id = humidity.logId_id
INNER JOIN pressure ON logId.id = pressure.logId_id
INNER JOIN wind ON logId.id = wind.logId_id
WHERE logId.datetime >= ? AND logId.datetime <= ? AND stationId = ?
".$string." ORDER BY logId.datetime desc");

//Using prepared statements for additional security
$stmt->bind_param("ssi",$fromDate,$toDate,$stationId);
$stmt->execute();
$result = $stmt->get_result();
$results = $stmt->store_result();
//Create a new array and store rows from query in this array
$array = array();
while($row = $result->fetch_assoc()) {
    $row["temperatureAvg"] = round($row["temperatureAvg"],3);
    $row["temperatureMin"] = round($row["temperatureMin"],3);
    $row["temperatureMax"] = round($row["temperatureMax"],3);
    $array[] = $row;
}
//Json encode array and send back to client

echo json_encode($array,JSON_PRETTY_PRINT);
?>
