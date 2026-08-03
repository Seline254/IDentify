<?php

// Fetch credentials from the host environment
$db_server   = getenv('DB_HOST');
$db_username = getenv('DB_USER');
$db_password = getenv('DB_PASSWORD');
$db_name     = getenv('DB_NAME');
$db_port     = getenv('DB_PORT')

function connect_db() {
    global $db_server, $db_username, $db_password, $db_port;
    
    $conn = mysqli_connect($db_server, $db_username, $db_password, "IDentifyDB", $db_port);
    
    if (!$conn) {
        die(json_encode(['error' => 'Could not connect to database']));
    }
    
    return $conn;
}
?>