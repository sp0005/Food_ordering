<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 

include("../config.php");

try {
    $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "messages" => $messages]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
