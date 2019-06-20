<?php
// Enter details for database
$mysqli = $mysqli = new mysqli(INSERT);
//Example for request: weatherData.php?fromDate=2014-06-01+00:02:00&toDate=2014-06-01+02:02:00&stationId=1&dayOnly=1

//Get parameters specified by user
$fromDate = $_GET["fromDate"];
$toDate = $_GET["toDate"] . " 23:59:59";
$stationId = $_GET["stationId"];

//Replace + with space. Result string will be in the format "yyyy-mm-dd hh:MM:ss"




// Prepare sql statement
$stmt = $mysqli->prepare("SELECT * from RealTimeMesurements where mesure_time >= ? and mesure_time <= ? and station_id = ? order by mesure_time desc");

//Using prepared statements for additional security
$stmt->bind_param("ssi",$fromDate,$toDate,$stationId);
$stmt->execute();
$result = $stmt->get_result();
$results = $stmt->store_result();
//Create a new array and store rows from query in this array
$array = array();
while($row = $result->fetch_assoc()) {
    $array[] = $row;
}
//Json encode array and send back to client

echo json_encode($array,JSON_PRETTY_PRINT);
?>
