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

// Get column names and data types from information_schema
$columnsQuery = "SELECT column_name AS title FROM information_schema.columns WHERE table_schema = :dbname AND table_name = :tableName";
$columnsStmt = $pdo->prepare($columnsQuery);
$columnsStmt->bindValue(':dbname', DB_NAME, PDO::PARAM_STR);
$columnsStmt->bindParam(':tableName', $tableName, PDO::PARAM_STR);
$columnsStmt->execute();
$columns = $columnsStmt->fetchAll(PDO::FETCH_ASSOC);

// Get data from the specified table
$dataQuery = "SELECT * FROM $tableName";
$dataStmt = $pdo->query($dataQuery);
$tableData = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

// Output the result
echo json_encode(['success' => true, 'fields' => $columns, 'data' => $tableData]);
?>
