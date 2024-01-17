<?php
    // TODO: add more deletion logic for removing
    // other files of the page like css and js not needed

    include '../../auth/functions/isLoggedInAdmin.php';

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
    $pageKey = $_POST['pageKey'];

    // Include necessary files
    include '../../general/functions/getClearPath.php';

    // Define file paths
    $jsonFilePath = getClearPath() . "sd-content/data/pages/" . $pageKey . ".json";

    // Check if files exist before deletion
    if (!file_exists($jsonFilePath)) {
        echo json_encode(['success' => false, 'error' => 'Files not found']);
        exit(); // Stop further execution
    }

    $fileContent = json_decode(file_get_contents($jsonFilePath), true);
    $pageFilePath = getClearPath() . $fileContent['pageURL'];

    // Delete JSON file
    unlink($jsonFilePath);

    // Delete page file
    if(file_exists($pageFilePath)){
        unlink($pageFilePath);
    }

    echo json_encode(['success' => true]);
    exit(); // Stop further execution
?>
