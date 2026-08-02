<?php
$db_server = "localhost";
$db_username = "root";
$db_password = "";

function connect_db() {
    global $db_server, $db_username, $db_password;
    
    $conn = mysqli_connect($db_server, $db_username, $db_password, "IDentifyDB");
    
    if (!$conn) {
        die(json_encode(['error' => 'Could not connect to database']));
    }
    
    return $conn;
}
?>