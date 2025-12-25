<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include '../config.php';

try {
    $report = [];

    // ===============================
    // Dates for ranges
    // ===============================
    $today = (new DateTime())->format('Y-m-d');
    $weekAgo = (new DateTime())->modify('-7 days')->format('Y-m-d');
    $monthAgo = (new DateTime())->modify('-30 days')->format('Y-m-d');
    $yearAgo = (new DateTime())->modify('-365 days')->format('Y-m-d');

    // ===============================
    // 1️⃣ REVENUE
    // ===============================
    // Daily revenue (today)
    $stmt = $pdo->prepare("SELECT SUM(oi.quantity * oi.price) AS total FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.status='Delivered' AND DATE(o.created_at) = ?");
    $stmt->execute([$today]);
    $report['dailyRevenue'] = (float) ($stmt->fetch()['total'] ?? 0);

    // Weekly revenue (last 7 days excluding today)
    $stmt = $pdo->prepare("SELECT SUM(oi.quantity * oi.price) AS total FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.status='Delivered' AND DATE(o.created_at) >= ? AND DATE(o.created_at) < ?");
    $stmt->execute([$weekAgo, $today]);
    $report['weeklyRevenue'] = (float) ($stmt->fetch()['total'] ?? 0);

    // Monthly revenue (last 30 days excluding weekly)
    $stmt = $pdo->prepare("SELECT SUM(oi.quantity * oi.price) AS total FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.status='Delivered' AND DATE(o.created_at) >= ? AND DATE(o.created_at) < ?");
    $stmt->execute([$monthAgo, $weekAgo]);
    $report['monthlyRevenue'] = (float) ($stmt->fetch()['total'] ?? 0);

    // Yearly revenue (last 365 days excluding monthly)
    $stmt = $pdo->prepare("SELECT SUM(oi.quantity * oi.price) AS total FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.status='Delivered' AND DATE(o.created_at) >= ? AND DATE(o.created_at) < ?");
    $stmt->execute([$yearAgo, $monthAgo]);
    $report['yearlyRevenue'] = (float) ($stmt->fetch()['total'] ?? 0);

    // ===============================
    // 2️⃣ USER STATS
    // ===============================
    // Daily users (today)
    $stmt = $pdo->prepare("SELECT COUNT(*) AS total FROM users WHERE DATE(created_at) = ?");
    $stmt->execute([$today]);
    $report['dailyUsers'] = (int) ($stmt->fetch()['total'] ?? 0);

    // Weekly users (last 7 days excluding today)
    $stmt = $pdo->prepare("SELECT COUNT(*) AS total FROM users WHERE DATE(created_at) >= ? AND DATE(created_at) < ?");
    $stmt->execute([$weekAgo, $today]);
    $report['weeklyUsers'] = (int) ($stmt->fetch()['total'] ?? 0);

    // Monthly users (last 30 days excluding weekly)
    $stmt = $pdo->prepare("SELECT COUNT(*) AS total FROM users WHERE DATE(created_at) >= ? AND DATE(created_at) < ?");
    $stmt->execute([$monthAgo, $weekAgo]);
    $report['monthlyUsers'] = (int) ($stmt->fetch()['total'] ?? 0);

    // Yearly users (last 365 days excluding monthly)
    $stmt = $pdo->prepare("SELECT COUNT(*) AS total FROM users WHERE DATE(created_at) >= ? AND DATE(created_at) < ?");
    $stmt->execute([$yearAgo, $monthAgo]);
    $report['yearlyUsers'] = (int) ($stmt->fetch()['total'] ?? 0);

    // ===============================
    // 3️⃣ TOP 2 SELLING ITEMS
    // ===============================
    $stmt = $pdo->query("
        SELECT m.id, m.name, m.image, SUM(oi.quantity) AS total_quantity, SUM(oi.quantity * oi.price) AS total_sales
        FROM order_items oi
        JOIN menu_items m ON oi.menu_item_id = m.id
        JOIN orders o ON oi.order_id = o.id
        WHERE o.status='Delivered'
        GROUP BY m.id
        ORDER BY total_quantity DESC
        LIMIT 2
    ");
    $report['topSelling'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ===============================
    // 4️⃣ USER LIST
    // ===============================
    $stmt = $pdo->query("SELECT id, name, email, phone, food_preference, created_at FROM users ORDER BY id DESC");
    $report['users'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($report);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
