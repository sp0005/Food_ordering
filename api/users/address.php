<?php
include_once("../config.php");
header("Content-Type: application/json");

$user_id = $_GET['user_id'] ?? 0;

if (!$user_id) {
    echo json_encode([]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT default_location, default_address FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $address = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($address ?: []);
} catch (PDOException $e) {
    echo json_encode([]);
}
?>
