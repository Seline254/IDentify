<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function require_role($required_role) {
    if (!isset($_SESSION['role'])) {
        http_response_code(401);
        die(json_encode(['error' => 'Not logged in']));
    }
    
    if ($_SESSION['role'] !== $required_role) {
        http_response_code(403);
        die(json_encode(['error' => 'Unauthorized']));
    }
}
?>