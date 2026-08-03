<?php
require_once '../../config/db.php';

$query = $_GET['q'] ?? '';

if (empty($query)) {
    echo json_encode(['error' => 'Search term required']);
    exit;
}

$conn = connect_db();
$query = mysqli_real_escape_string($conn, $query);

$result = mysqli_query($conn,
    "SELECT reg_number, full_name, course, college, gate, status, date_logged
     FROM inventory_records
     WHERE (reg_number = '$query' OR full_name LIKE '%$query%')
     AND status = 'in_custody'"
);

if (!$result) {
    echo json_encode(['error' => 'Search failed']);
    exit;
}

$records = [];
while ($row = mysqli_fetch_assoc($result)) {
    $records[] = $row;
}

echo json_encode(['success' => true, 'data' => $records]);

mysqli_close($conn);
?>