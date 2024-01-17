<?php
    header('Content-Type: application/json');
    include 'functions/isLoggedInAdmin.php';

    $result = isAdminLoggedIn();

    echo json_encode($result);
?>
