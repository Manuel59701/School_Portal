<?php
// backend/api/admin/classes.php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$storageFile = __DIR__ . '/classes_data.json';

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $current = file_exists($storageFile) ? json_decode(file_get_contents($storageFile), true) : [];
    if (!is_array($current)) $current = [];

    $newClass = [
        "id" => time(),
        "name" => $input['name'] ?? 'New Class',
        "level" => $input['level'] ?? 'secondary',
        "section" => $input['section'] ?? '',
        "studentCount" => 0
    ];

    $current[] = $newClass;
    file_put_contents($storageFile, json_encode($current, JSON_PRETTY_PRINT));

    echo json_encode(["success" => true, "class" => $newClass]);
    exit();
}

if ($method === 'GET') {
    $current = file_exists($storageFile) ? json_decode(file_get_contents($storageFile), true) : [];
    echo json_encode(["success" => true, "data" => $current]);
    exit();
}
