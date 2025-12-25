<?php
header("Content-Type: application/json");
include("../config.php");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["user_id"], $data["order_id"], $data["total_amount"], $data["transaction_uuid"])) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO orders (user_id, order_id, total_amount, transaction_uuid, status, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([
        $data["user_id"],
        $data["order_id"],
        $data["total_amount"],
        $data["transaction_uuid"],
        $data["status"]
    ]);

    echo json_encode(["success" => true, "message" => "Order created successfully"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
