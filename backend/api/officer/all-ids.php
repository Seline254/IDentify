<?php
session_start();
require_once '../../middleware/role-check.php';
require_once '../../config/db.php';

require_role('officer');

$conn = connect_lost_ids_db();

$result = mysqli_query($conn, "SELECT * FROM lost_ids WHERE status = 'in_custody'");

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