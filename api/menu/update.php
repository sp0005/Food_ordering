<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config.php';

$id = $_POST['id'] ?? '';
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$price = $_POST['price'] ?? 0;
$preference = $_POST['preference'] ?? 'veg';
$image = '';

if(isset($_FILES['image']) && $_FILES['image']['name'] != ''){
    $targetDir = "../uploads/";
    if(!is_dir($targetDir)) mkdir($targetDir, 0777, true);

    $image = time() . "_" . basename($_FILES["image"]["name"]);
    $targetFile = $targetDir . $image;
    move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile);
}

try {
    if($image){
        $stmt = $pdo->prepare("UPDATE menu_items SET name=?, description=?, price=?, preference=?, image=? WHERE id=?");
        $stmt->execute([$name, $description, $price, $preference, $image, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE menu_items SET name=?, description=?, price=?, preference=? WHERE id=?");
        $stmt->execute([$name, $description, $price, $preference, $id]);
    }
    echo json_encode(["status" => "success", "message" => "Menu updated successfully"]);
} catch(PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
