<?php

    include '../../auth/functions/isLoggedInAdmin.php';

    if (!isAdminLoggedIn()) {
        echo json_encode(['pages' => []]);
        exit(); // Stop further execution
    }

    include '../general/functions/getJsonsFromFolder.php';
    include '../../general/functions/getClearPath.php';

    // Replace 'pages' with the actual folder path
    $pages = getJsonsFromFolder(getClearPath()."sd-content/data/pages");

    echo json_encode(['pages' => $pages]);
?>