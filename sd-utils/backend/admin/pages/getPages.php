<?php

    require_once('../../auth/functions/isLoggedInAdmin.php');

    if (!isAdminLoggedIn()) {
        echo json_encode(['pages' => []]);
        exit(); // Stop further execution
    }

    require_once('../general/functions/getJsonsFromFolder.php');
    require_once('../../general/functions/getClearPath.php');

    // Replace 'pages' with the actual folder path
    $pages = getJsonsFromFolder(getClearPath()."sd-content/data/pages");

    echo json_encode(['pages' => $pages]);
?>