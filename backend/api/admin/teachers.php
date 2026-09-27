<?php
// backend/api/admin/teachers.php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$storageFile = __DIR__ . '/teachers_data.json';

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $current = file_exists($storageFile) ? json_decode(file_get_contents($storageFile), true) : [];
    if (!is_array($current)) $current = [];

    $newTeacher = [
        "id" => time(),
        "name" => $input['name'] ?? '',
        "email" => $input['email'] ?? '',
        "subject" => $input['subject'] ?? '',
        "classAssigned" => $input['classAssigned'] ?? '',
        "status" => "Active"
    ];

    $current[] = $newTeacher;
    file_put_contents($storageFile, json_encode($current, JSON_PRETTY_PRINT));

    echo json_encode(["success" => true, "teacher" => $newTeacher]);
    exit();
}

if ($method === 'GET') {
    $current = file_exists($storageFile) ? json_decode(file_get_contents($storageFile), true) : [];
    echo json_encode(["success" => true, "data" => $current]);
    exit();
}
