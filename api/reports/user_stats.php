<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config.php';

$time = $_GET['time'] ?? 'daily';

try {
    if ($time === 'daily') {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()");
    } elseif ($time === 'weekly') {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE DATEDIFF(CURDATE(), created_at) >= 7 AND DATEDIFF(CURDATE(), created_at) < 30");
    } elseif ($time === 'monthly') {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE DATEDIFF(CURDATE(), created_at) >= 30 AND DATEDIFF(CURDATE(), created_at) < 365");
    } elseif ($time === 'yearly') {
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE DATEDIFF(CURDATE(), created_at) >= 365");
    }

    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["count" => $result['count']]);
} catch (PDOException $e) {
    echo json_encode(["count" => 0, "error" => $e->getMessage()]);
}   