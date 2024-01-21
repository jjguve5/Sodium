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
$tableName = $_POST['tableName'];

// Validate the table name (optional)
if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $tableName)) {
    echo json_encode(['success' => false, 'error' => 'Invalid table name']);
    exit();
}

// Construct the SQL query for creating the table
$query = "CREATE TABLE $tableName (
    id INT PRIMARY KEY AUTO_INCREMENT
);";

try {
    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $tableInfo = [
        'title' => $tableName,
        'fields' => [
            [
                'name' => 'id',
                'type' => 'int',
                'max_length' => null,
                'default' => null,
            ]
        ]
    ];

    echo json_encode(['success' => true, 'table' => $tableInfo]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Failed to create table', 'table' => null]);
}
?>
