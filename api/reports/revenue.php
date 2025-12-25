<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config.php';

$time = $_GET['time'] ?? 'daily';

try {
    if ($time === 'daily') {
        $stmt = $pdo->prepare("
            SELECT SUM(oi.quantity * oi.price) AS total
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.status='Delivered' 
            AND DATE(o.created_at) = CURDATE()
        ");
    } elseif ($time === 'weekly') {
        $stmt = $pdo->prepare("
            SELECT SUM(oi.quantity * oi.price) AS total
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.status='Delivered' 
            AND DATE(o.created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            AND DATE(o.created_at) < CURDATE()
        ");
    } elseif ($time === 'monthly') {
        $stmt = $pdo->prepare("
            SELECT SUM(oi.quantity * oi.price) AS total
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.status='Delivered' 
            AND DATE(o.created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            AND DATE(o.created_at) < DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        ");
    } elseif ($time === 'yearly') {
        $stmt = $pdo->prepare("
            SELECT SUM(oi.quantity * oi.price) AS total
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.status='Delivered' 
            AND DATE(o.created_at) >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)
            AND DATE(o.created_at) < DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        ");
    }

    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "total" => $result['total'] ?? 0
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
