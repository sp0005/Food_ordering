<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config.php';

try {
    // Optional filter by preference: veg or nonveg
    $preference = $_GET['preference'] ?? '';

    // Query menu items with totals only for Delivered orders
    $sql = "
        SELECT m.id, m.name, m.preference,
               COALESCE(SUM(CASE WHEN o.status='Delivered' THEN oi.quantity ELSE 0 END), 0) AS total_quantity,
               COALESCE(SUM(CASE WHEN o.status='Delivered' THEN oi.quantity * oi.price ELSE 0 END), 0) AS total_sales
        FROM menu_items m
        LEFT JOIN order_items oi ON oi.menu_item_id = m.id
        LEFT JOIN orders o ON oi.order_id = o.id
    ";

    $params = [];
    if ($preference === 'veg' || $preference === 'nonveg') {
        $sql .= " WHERE m.preference = :pref";
        $params['pref'] = $preference;
    }

    // Group by menu item, filter out items with 0 quantity, sort by quantity sold
    $sql .= "
        GROUP BY m.id
        HAVING total_quantity > 0
        ORDER BY total_quantity DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $topItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "top_items" => $topItems
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
