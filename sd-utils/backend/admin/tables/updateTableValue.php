<?php
require_once('../../auth/functions/isLoggedInAdmin.php');

if (!isAdminLoggedIn()) {
    echo json_encode(['success' => false, 'error' => 'Not authorized']);
    exit();
}

// Establish a connection to the database
require_once('../../db/connect.php');

// Get post vars
$postData = file_get_contents('php://input');
if (empty($postData)) {
    echo json_encode(['success' => false, 'error' => 'Invalid request']);
    exit();
}

$_POST = json_decode($postData, true);
$tableName = $_POST['table'];
$columnName = $_POST['column'];
$rowId = $_POST['row'];
$newValue = $_POST['value'];

// Construct the SQL query for updating the column value
$query = "UPDATE $tableName SET $columnName = :newValue WHERE id = :rowId";

try {
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':newValue', $newValue, PDO::PARAM_STR);
    $stmt->bindParam(':rowId', $rowId, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Failed to update value']);
}
?>
