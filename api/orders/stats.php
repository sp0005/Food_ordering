<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config.php';

try {
    $stmtTotal = $pdo->query("SELECT COUNT(*) as total_orders FROM orders");
    $totalOrders = $stmtTotal->fetch(PDO::FETCH_ASSOC)['total_orders'];

    $stmtActive = $pdo->query("
        SELECT COUNT(*) as active_orders 
        FROM orders 
        WHERE status IN ('Order Placed', 'Cooking', 'On the way')
    ");
    $activeOrders = $stmtActive->fetch(PDO::FETCH_ASSOC)['active_orders'];

    $stmtDelivered = $pdo->query("SELECT COUNT(*) as delivered_orders FROM orders WHERE status = 'Delivered'");
    $deliveredOrders = $stmtDelivered->fetch(PDO::FETCH_ASSOC)['delivered_orders'];

    $stmtCancelled = $pdo->query("SELECT COUNT(*) as cancelled_orders FROM orders WHERE status = 'Cancelled'");
    $cancelledOrders = $stmtCancelled->fetch(PDO::FETCH_ASSOC)['cancelled_orders'];

    $stmtSales = $pdo->query("
        SELECT SUM(oi.price * oi.quantity) as total_sales 
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.status = 'Delivered'
    ");
    $totalSales = $stmtSales->fetch(PDO::FETCH_ASSOC)['total_sales'] ?? 0;

    echo json_encode([
        "total_orders" => (int)$totalOrders,
        "active_orders" => (int)$activeOrders,
        "delivered_orders" => (int)$deliveredOrders,
        "cancelled_orders" => (int)$cancelledOrders,
        "total_sales" => (float)$totalSales
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
