<?php
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// session_start();
// rest of the file...

session_start();
// require_once '../../middleware/role-check.php';
require_once '../../config/db.php';

// require_role('officer');

$conn = connect_db();

$result = mysqli_query($conn, "SELECT * FROM inventory_records WHERE status = 'in_custody'");

if (!$result) {
    echo json_encode(['error' => 'Could not fetch IDs']);
    exit;
}

$ids = [];
while ($row = mysqli_fetch_assoc($result)) {
    $ids[] = $row;
}

echo json_encode(['success' => true, 'data' => $ids]);

mysqli_close($conn);
?>