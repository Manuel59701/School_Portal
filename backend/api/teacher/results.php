<?php
// backend/api/teacher/results.php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$storageFile = __DIR__ . '/results_data.json';

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    
    // Store in JSON file so teachers and students can see changes immediately
    $current = file_exists($storageFile) ? json_decode(file_get_contents($storageFile), true) : [];
    if (!is_array($current)) $current = [];

    $key = ($input['class'] ?? 'default') . '_' . ($input['subject'] ?? 'general');
    $current[$key] = [
        "class" => $input['class'] ?? '',
        "subject" => $input['subject'] ?? '',
        "term" => $input['term'] ?? '',
        "updated_at" => date('Y-m-d H:i:s'),
        "results" => $input['results'] ?? []
    ];

    file_put_contents($storageFile, json_encode($current, JSON_PRETTY_PRINT));

    echo json_encode([
        "success" => true,
        "message" => "Results recorded and published successfully.",
        "count" => count($input['results'] ?? [])
    ]);
    exit();
}

if ($method === 'GET') {
    $current = file_exists($storageFile) ? json_decode(file_get_contents($storageFile), true) : [];
    echo json_encode([
        "success" => true,
        "data" => $current
    ]);
    exit();
}
