<?php
session_start();
require_once '../../middleware/role-check.php';
require_once '../../config/db.php';

require_role('officer');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

// Collect all four fields from the physical ID
$reg_number = $_POST['reg_number'] ?? '';
$name       = $_POST['name'] ?? '';
$course     = $_POST['course'] ?? '';
$college    = $_POST['college'] ?? '';
$gate       = $_SESSION['gate']; // comes from officer session, not the form

if (empty($reg_number) || empty($name) || empty($course) || empty($college)) {
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

// Step 1 — verify student exists in school DB
$school_conn = connect_school_db();

$reg_escaped = mysqli_real_escape_string($school_conn, $reg_number);

$student = mysqli_query($school_conn, 
    "SELECT * FROM students WHERE reg_number = '$reg_escaped'"
);

if (!$student || mysqli_num_rows($student) === 0) {
    echo json_encode(['error' => 'Student not found in school database']);
    exit;
}

mysqli_close($school_conn);

// Step 2 — check this ID isn't already logged
$lost_conn = connect_lost_ids_db();

$name_escaped    = mysqli_real_escape_string($lost_conn, $name);
$course_escaped  = mysqli_real_escape_string($lost_conn, $course);
$college_escaped = mysqli_real_escape_string($lost_conn, $college);
$gate_escaped    = mysqli_real_escape_string($lost_conn, $gate);

$existing = mysqli_query($lost_conn,
    "SELECT * FROM lost_ids 
     WHERE reg_number = '$reg_escaped' AND status = 'in_custody'"
);

if ($existing && mysqli_num_rows($existing) > 0) {
    echo json_encode(['error' => 'This ID is already logged as in custody']);
    exit;
}

// Step 3 — create the record
$officer_id = $_SESSION['officer_id'];

$insert = mysqli_query($lost_conn,
    "INSERT INTO lost_ids (reg_number, name, course, college, gate, status, logged_by)
     VALUES ('$reg_escaped', '$name_escaped', '$course_escaped', '$college_escaped', '$gate_escaped', 'in_custody', '$officer_id')"
);

if (!$insert) {
    echo json_encode(['error' => 'Could not log item']);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'ID logged successfully',
    'item_id' => mysqli_insert_id($lost_conn)
]);

mysqli_close($lost_conn);
?>