<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config.php';

try {
    $stmt = $pdo->query("SELECT id, name, email, phone, food_preference, created_at FROM users ORDER BY id DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
