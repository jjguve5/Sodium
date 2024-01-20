<?php

    require_once('../../auth/functions/isLoggedInAdmin.php');

    if (!isAdminLoggedIn()) {
        echo json_encode(['tables' => []]);
        exit(); // Stop further execution
    }

    // Establish a connection to the database
    require_once('../../db/connect.php');
    
    // Query to get table names and columns from information_schema
    $query = "
        SELECT table_name, column_name, data_type, character_maximum_length, column_default
        FROM information_schema.columns
        WHERE table_schema = :dbname
        ORDER BY table_name, ordinal_position
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':dbname', DB_NAME, PDO::PARAM_STR);
    $stmt->execute();

    // Fetch table names and columns
    $tables = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $tableName = $row['table_name'];
        $columnName = $row['column_name'];
        $dataType = $row['data_type'];
        $maxLength = $row['character_maximum_length'];
        $defaultValue = $row['column_default'];

        // Store table information
        if (!isset($tables[$tableName])) {
            $tables[$tableName] = ['title' => $tableName, 'fields' => []];
        }

        // Store field information
        $tables[$tableName]['fields'][] = [
            'name' => $columnName,
            'type' => $dataType,
            'max_length' => $maxLength,
            'default' => $defaultValue,
        ];
    }

    // Output the array of tables
    echo json_encode(['tables' => array_values($tables)]);
?>
