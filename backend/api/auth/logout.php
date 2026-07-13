<?php
session_start();
require_once '../../middleware/role-check.php';

require_role('officer');

// Destroy everything in the session
session_unset();
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
?>