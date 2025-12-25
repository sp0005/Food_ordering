<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include("../config.php"); 


$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name'], $data['email'], $data['message'])) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

$name = trim($data['name']);
$email = trim($data['email']);
$message = trim($data['message']);

// Simple validation
if (strlen($name) < 2 || strlen($message) < 10 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $message]);
    echo json_encode(["success" => true, "message" => "Message sent successfully!"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
