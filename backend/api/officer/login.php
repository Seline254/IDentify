<?php
session_start();
require_once '../../config/db.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

$username = mysqli_real_escape_string(connect_lost_ids_db(), $_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['error' => 'Username and password are required']);
    exit;
}

$conn = connect_lost_ids_db();

$result = mysqli_query($conn, "SELECT * FROM officers WHERE username = '$username' AND is_active = 1");

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

$officer = mysqli_fetch_assoc($result);

// Compare entered password against stored hash
if (!password_verify($password, $officer['password_hash'])) {
    echo json_encode(['error' => 'Invalid credentials']);
    exit;
}

// Credentials valid — create session
session_regenerate_id(true);
$_SESSION['role'] = 'officer';
$_SESSION['officer_id'] = $officer['id'];
$_SESSION['officer_name'] = $officer['full_name'];
$_SESSION['gate'] = $officer['gate'];

// Update last login
mysqli_query($conn, "UPDATE officers SET last_login = NOW() WHERE id = " . $officer['id']);

echo json_encode([
    'success' => true,
    'officer' => $officer['full_name'],
    'gate' => $officer['gate']
]);

mysqli_close($conn);
?>