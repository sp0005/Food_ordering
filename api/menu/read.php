<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config.php';

$type = $_GET['type'] ?? ''; 

try {
    if ($type === 'veg' || $type === 'nonveg') {
        $stmt = $pdo->prepare("SELECT * FROM menu_items WHERE preference = ? ORDER BY id DESC");
        $stmt->execute([$type]);
    } elseif ($type === 'both') {
        $stmt = $pdo->query("SELECT * FROM menu_items ORDER BY id DESC");
    } else {
        $stmt = $pdo->query("SELECT * FROM menu_items ORDER BY id DESC");
    }

    $menus = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmtOrders = $pdo->query("
        SELECT menu_item_id, SUM(quantity) AS total_sold
        FROM order_items
        GROUP BY menu_item_id
    ");
    $orderCounts = $stmtOrders->fetchAll(PDO::FETCH_ASSOC);

    $soldMap = [];
    foreach ($orderCounts as $row) {
        $soldMap[$row['menu_item_id']] = (int)$row['total_sold'];
    }

    foreach ($menus as &$menu) {
        $menuId = $menu['id'];
        $menu['total_sold'] = $soldMap[$menuId] ?? 0;
        $menu['popular'] = false;
    }

    $sorted = $menus;
    usort($sorted, fn($a, $b) => $b['total_sold'] <=> $a['total_sold']);

    foreach (array_slice($sorted, 0, 5) as $popularItem) {
        foreach ($menus as &$menu) {
            if ($menu['id'] == $popularItem['id']) {
                $menu['popular'] = true;
                break;
            }
        }
    }

    echo json_encode($menus);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
