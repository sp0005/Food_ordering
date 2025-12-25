<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['user_id']) || !isset($data['address']) || !isset($data['location'])) {
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE users SET address = ?, location = ? WHERE id = ?");
    $stmt->execute([$data['address'], $data['location'], $data['user_id']]);

    echo json_encode(['success' => true, 'message' => 'Address updated successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
