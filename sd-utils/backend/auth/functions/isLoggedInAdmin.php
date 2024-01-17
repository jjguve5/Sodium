<?php
session_start();

function isAdminLoggedIn() {
    return isset($_SESSION['email']) && isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}
?>
