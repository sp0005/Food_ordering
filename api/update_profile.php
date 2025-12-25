<?php
// ===== CORS Headers =====
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'config.php';

// Get JSON body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

$id = $data['id'] ?? null;
$name = trim($data['name'] ?? '');
$foodPreference = trim($data['foodPreference'] ?? '');

if (!$id || $name === '' || $foodPreference === '') {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    // Update user
    $stmt = $pdo->prepare("UPDATE users SET name = ?, food_preference = ? WHERE id = ?");
    $stmt->execute([$name, $foodPreference, $id]);

    // Fetch updated user (important!)
    $stmt2 = $pdo->prepare("SELECT id, name, phone, email, food_preference FROM users WHERE id = ?");
    $stmt2->execute([$id]);
    $updatedUser = $stmt2->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully',
        'user' => $updatedUser
    ]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
