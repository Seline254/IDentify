<?php

// Fetch credentials from the host environment
$db_server   = getenv('DB_HOST');
$db_username = getenv('DB_USER');
$db_password = getenv('DB_PASSWORD');
$db_name     = getenv('DB_NAME');
$db_port     = getenv('DB_PORT'); // Semicolon added here

function connect_db() {
    // Added $db_name to the global scope
    global $db_server, $db_username, $db_password, $db_name, $db_port;
    
    // 1. Initialize the MySQLi object
    $conn = mysqli_init();
    
    // 2. Point to the downloaded Aiven CA certificate for SSL verification
    // Make sure 'ca.pem' is in the same directory as this script
    mysqli_ssl_set($conn, NULL, NULL, __DIR__ . '/ca.pem', NULL, NULL);
    
    // 3. Establish the secure connection
    mysqli_real_connect($conn, $db_server, $db_username, $db_password, $db_name, $db_port);
    
    // 4. Verify the connection was successful
    if (mysqli_connect_errno()) {
        die(json_encode(['error' => 'Could not connect to database: ' . mysqli_connect_error()]));
    }
    
    return $conn;
}
?>