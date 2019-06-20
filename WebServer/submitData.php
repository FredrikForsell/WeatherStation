<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Enter details for database
$mysqli = new mysqli(INSERT CONNECTIONPROPERTIES);

// The server key has to match with the key provided by the client
$serverKey= "INSERTSECRETKEY";

/* Resonse codes
1 - Invalid server key check that python program has the same server key
2 - Failed to create logId row with provided data, no changes made
3 - Failed to insert data for one or more variables
*/
// Decode json from Raspberry PI
$data = json_decode(file_get_contents('php://input'), true);
$responseObject = new stdClass();
$responseObject->status = 0;

if($data["serverKey"] != $serverKey) {
    $responseObject->status= 1;
    jsonEncodeEcho($responseObject);
    exit();
}

$stmt = $mysqli->prepare("INSERT INTO logId (id,datetime,stationId) VALUES (NULL,?,?)");

//Using prepared statements for additional security
$stmt->bind_param("si",$data['measureHour'],$data['stationId']);
if(!$stmt->execute()) {
  $responseObject->status = 2;
  jsonEncodeEcho($responseObject);
  exit();
}

$lastInsert = $stmt->insert_id;

/*
{'averageTemperature':0,'maxTemperature':-1000,'minTemperature':2000,'minTemperatureTime':0,'maxTemperatureTime':0,
                    'averageWindspeed':0,'maxWindspeed':-1000,'minWindspeed':2000,'minWindspeedTime':0,'maxWindspeedTime':0,
                    'averageHumidity':0,'maxHumidity':-1000,'minHumidity':2000,'minHumidityTime':0,'maxHumidityTime':0,
                    'averagePressure':0,'maxPressure':-1000,'minPressure':2000,'minPressureTime':0,'maxPressureTime':0,
                    'averageTemperature':0,'maxTemperature':-1000,'minTemperature':2000,'minTemperatureTime':0,'maxTemperatureTime':0,
                    'averageWindDirection':None,
                    'mesureHour':'','stationId':stationId,'serverKey':serverKey
                    }
*/
// insert for windspeed and direction
$stmt = $mysqli->prepare("INSERT INTO wind (logId_id,windspeedAvg,windspeedNow,windspeedMax,windspeedMin,timeMax,timeMin,winddirectionMax) VALUES (?,?,?,?,?,?,?,?)");
$stmt->bind_param("iddddssd",$lastInsert,$data["averageWindspeed"],$data["averageWindspeed"],$data["maxWindspeed"],$data["minWindspeed"],$data["maxWindspeedTime"],$data["minWindspeedTime"],$data["averageWindDirection"]);
if(!$stmt->execute()) {
  $responseObject->status = 3;
}
// insert for humidity
$stmt = $mysqli->prepare("INSERT INTO humidity (logId_id,humidityAvg,humidityNow,humidityMin,humidityMax,timeMin,timeMax) VALUES (?,?,?,?,?,?,?)");
$stmt->bind_param("iddddss",$lastInsert,$data["averageHumidity"],$data["averageHumidity"],$data["minHumidity"],$data["maxHumidity"],$data["minHumidityTime"],$data["maxHumidityTime"]);
if(!$stmt->execute()) {
  $responseObject->status = 3;
}



// instert for pressure
$stmt = $mysqli->prepare("INSERT INTO pressure (logId_id,pressureAvg,pressureNow,pressureMin,pressureMax,timeMin,timeMax) VALUES (?,?,?,?,?,?,?)");
$stmt->bind_param("iddddss",$lastInsert,$data["averagePressure"],$data["averagePressure"],$data["minPressure"],$data["maxPressure"],$data["minPressureTime"],$data["maxPressureTime"]);
if(!$stmt->execute()) {
  $responseObject->status = 3;
}

// insert for temperature
$stmt = $mysqli->prepare("INSERT INTO temperature (logId_id,temperatureAvg,temperatureNow,temperatureMin,temperatureMax,timeMin,timeMax) VALUES (?,?,?,?,?,?,?)");
$stmt->bind_param("iddddss",$lastInsert,$data["averageTemperature"],$data["averageTemperature"],$data["minTemperature"],$data["maxTemperature"],$data["minTemperatureTime"],$data["maxTemperatureTime"]);
$stmt->error;
if(!$stmt->execute()) {
  $responseObject->status = 3;
}
jsonEncodeEcho($responseObject);

exit();
//Json encode array and send back to client
function jsonEncodeEcho($obj) {
  echo $obj->status;
}



 ?>
