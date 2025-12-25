<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config.php';

$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? 0;
$preference = $_POST['preference'] ?? 'veg';
$image = '';

if(isset($_FILES['image'])) {
    $targetDir = "../uploads/";
    if(!is_dir($targetDir)) mkdir($targetDir, 0777, true);
    
    $image = time() . "_" . basename($_FILES["image"]["name"]);
    $targetFile = $targetDir . $image;
    if(!move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)){
        echo json_encode(["status" => "error", "message" => "Image upload failed"]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare("INSERT INTO menu_items (name, description, price, preference, image, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$name, $description, $price, $preference, $image]);
    echo json_encode(["status" => "success", "message" => "Menu added successfully"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
