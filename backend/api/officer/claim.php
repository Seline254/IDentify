<?php
session_start();
// require_once '../../middleware/role-check.php';
require_once '../../config/db.php';

// require_role('officer');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit;
}

$item_id = $_POST['item_id'] ?? '';

if (empty($item_id)) {
    echo json_encode(['error' => 'Item ID is required']);
    exit;
}

$conn = connect_db();

$item_id = mysqli_real_escape_string($conn, $item_id);

$result = mysqli_query($conn,
    "SELECT * FROM INVENTORY_RECORDS WHERE id = '$item_id' AND status = 'in_custody'"
);

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(['error' => 'Item not found or already claimed']);
    exit;
}

$update = mysqli_query($conn,
    "UPDATE INVENTORY_RECORDS 
     SET status = 'claimed', claimed_at = NOW() 
     WHERE id = '$item_id'"
);

if (!$update) {
    echo json_encode(['error' => 'Could not update item status']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Item marked as claimed']);

mysqli_close($conn);
?>