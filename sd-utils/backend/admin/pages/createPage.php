<?php
    require_once('../../auth/functions/isLoggedInAdmin.php');

    if (!isAdminLoggedIn()) {
        echo json_encode(['success' => false]);
        exit(); // Stop further execution
    }

    // Get post vars
    $postData = file_get_contents('php://input');

    if (empty($postData)) {
        echo json_encode(['success' => false, 'error' => 'Invalid request']);
        exit(); // Stop further execution
    }

    $_POST = json_decode($postData, true);
    $pageName = $_POST['pageName'];

    // Define page configuration data
    $pageConfig = [
        "title" => ucwords(strtolower($pageName)),
        "createdOn" => time(), // Timestamp for creation
        "editedOn" => time(), // Timestamp for creation
        "pageURL" => strtolower(str_replace(' ', '', $pageName)) . ".html", // Adjust this based on your URL structure
        "deletable" => true,
        "key" => strtolower(str_replace(' ', '_', $pageName)) // Assuming the key is a lowercase version of the page name
    ];

    // Include necessary files
    require_once('../../general/functions/getClearPath.php');

    // Define file paths
    $jsonFilePath = getClearPath() . "sd-content/data/pages/" . $pageConfig['key'] . ".json";

    // Create JSON file
    file_put_contents($jsonFilePath, json_encode($pageConfig));

    // Define page file path
    $pageFilePath = getClearPath() . $pageConfig['pageURL'];

    // Create an empty page file (you may want to add initial content)
    file_put_contents($pageFilePath, '');

    echo json_encode(['success' => true, 'page' => json_encode($pageConfig)]);
    exit(); // Stop further execution
?>
