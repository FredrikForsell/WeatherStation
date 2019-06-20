<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Enter details for database
$mysqli = new mysqli(INSERT);
// The server key has to match with the key provided by the client
$serverKey= INSERTSECRETKEY

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

$stmt = $mysqli->prepare("INSERT INTO RealTimeMesurements (mesure_time,temperature,humidity,pressure,wind_speed,wind_direction,station_id) VALUES (?,?,?,?,?,?,?)");

//Using prepared statements for additional security
foreach($data["values"] as $obj) {
  $temperature = $obj['temperature'];
  $humidity = $obj['humidity'];
  $pressure = $obj['pressure'];
  $windSpeed = $obj['windSpeed'];
  $windDirection = $obj['windDirection'];
  if($windDirection +180 >= 360) {
    $windDirection = $windDirection-180;
  } else {
    $windDirection = $windDirection+180;
  }


  $stmt->bind_param("sdddddi",$obj['mesure_time'],$temperature,$humidity,$pressure,$windSpeed,$windDirection,$data["stationId"]);
  if(!$stmt->execute()) {
    $responseObject->status = 2;
  }
}
jsonEncodeEcho($responseObject);
exit();



function jsonEncodeEcho($obj) {
  echo $obj->status;
}

 ?>
