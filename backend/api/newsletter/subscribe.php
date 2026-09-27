<?php
// backend/api/newsletter/subscribe.php
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../../config/database.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Valid email address required."]);
    exit();
}

$db = (new Database())->getConnection();

if ($db) {
    try {
        $stmt = $db->prepare("INSERT INTO newsletter_subscribers (email) VALUES (:email) ON DUPLICATE KEY UPDATE id=id");
        $stmt->bindParam(":email", $email);
        $stmt->execute();
    } catch (Exception $e) {
        // Continue to respond
    }
}

// Persist also to JSON file for easy zero-setup testing
$dataFile = __DIR__ . '/subscribers.json';
$current = file_exists($dataFile) ? json_decode(file_get_contents($dataFile), true) : [];
if (!is_array($current)) $current = [];

$current[] = [
    "email" => $email,
    "subscribed_at" => date('Y-m-d H:i:s')
];
file_put_contents($dataFile, json_encode($current, JSON_PRETTY_PRINT));

echo json_encode([
    "success" => true,
    "message" => "Successfully subscribed to the school newsletter!",
    "email" => $email
]);
