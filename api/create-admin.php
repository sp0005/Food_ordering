<?php
$password = 'Admin123!'; 
$hashed = password_hash($password, PASSWORD_DEFAULT);
echo $hashed;
?>
