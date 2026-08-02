<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
// require_once '../../middleware/role-check.php';
require_once '../../config/db.php';

// require_role('officer');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

$reg_number = $_POST['reg_number'] ?? '';
$name       = $_POST['name'] ?? '';
$course     = $_POST['course'] ?? '';
$college    = $_POST['college'] ?? '';
$gate       = $_SESSION['gate'] ?? 'Main Gate';
$officer_id = $_SESSION['officer_id'] ?? 1;

if (empty($reg_number) || empty($name) || empty($course) || empty($college)) {
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$conn = connect_db();

$reg_number = mysqli_real_escape_string($conn, $reg_number);
$name       = mysqli_real_escape_string($conn, $name);
$course     = mysqli_real_escape_string($conn, $course);
$college    = mysqli_real_escape_string($conn, $college);
$gate       = mysqli_real_escape_string($conn, $gate);

// Check not already in custody
$existing = mysqli_query($conn,
    "SELECT id FROM INVENTORY_RECORDS 
     WHERE reg_number = '$reg_number' AND status = 'in_custody'"
);

if ($existing && mysqli_num_rows($existing) > 0) {
    echo json_encode(['error' => 'This ID is already logged as in custody']);
    exit;
}

$insert = mysqli_query($conn,
    "INSERT INTO INVENTORY_RECORDS (reg_number, full_name, course, college, gate, logged_by)
     VALUES ('$reg_number', '$name', '$course', '$college', '$gate', '$officer_id')"
);

if (!$insert) {
    echo json_encode(['error' => 'Could not log item']);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'ID logged successfully',
    'item_id' => mysqli_insert_id($conn)
]);

mysqli_close($conn);
?>