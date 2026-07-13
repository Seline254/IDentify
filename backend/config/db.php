<?php

$db_server = "localhost";
$db_username = "root";
$db_password = "";

function connect_school_db() {
    global $db_server, $db_username, $db_password;
    
    $conn = mysqli_connect($db_server, $db_username, $db_password, "school-db");
    
    if (!$conn) {
        die(json_encode(['error' => 'Could not connect to school database']));
    }
    
    return $conn;
}

function connect_lost_ids_db() {
    global $db_server, $db_username, $db_password;
    
    $conn = mysqli_connect($db_server, $db_username, $db_password, "lost-ids-db");
    
    if (!$conn) {
        die(json_encode(['error' => 'Could not connect to lost IDs database']));
    }
    
    return $conn;
}
?>