<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config.php';

$id = $_GET['id'] ?? '';

if(!$id){
    echo json_encode(["status" => "error", "message" => "ID is required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM menu_items WHERE id=?");
    $stmt->execute([$id]);
    echo json_encode(["status" => "success", "message" => "Menu deleted successfully"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
