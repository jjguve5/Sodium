<?php
    header('Content-Type: application/json');
    require_once('functions/isLoggedInAdmin.php');

    $result = isAdminLoggedIn();

    echo json_encode($result);
?>
