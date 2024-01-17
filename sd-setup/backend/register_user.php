<?php
// Include the configuration file to fetch database credentials
require_once('../../config.php');

// Error handling
$errors = [];

// Connect to the database using PDO (fetching credentials from config.php)
$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME;

try {
    $pdo = new PDO($dsn, DB_USER, DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if the users table is empty
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $tableEmpty = $stmt->fetchColumn() == 0;

    if ($tableEmpty) {
        // Retrieve the raw POST data
        $postData = file_get_contents('php://input');

        // Check if the data is in JSON format
        if (!empty($postData)) {
            // Decode the JSON data to an associative array
            $data = json_decode($postData, true);

            // Access the variables from the JSON data (email and password)
            $email = $data['email'];
            $password = $data['pass'];

            // Hash the password using bcrypt
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            // Prepare SQL statement to insert user data
            $stmt = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (:email, :password, 'admin')");
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->execute();

            // If the query was successful, perform login
            session_start();
            $_SESSION['email'] = $email;
            $_SESSION['role'] = 'admin';

            // Return success message and user data
            $response = [
                'success' => true,
                'message' => 'Admin user registered and logged in successfully!',
                'user' => [
                    'email' => $email,
                    'role' => 'admin'
                ]
            ];
            echo json_encode($response);

            // If the query was successful, replace index.html content
            $content = file_get_contents('../../page-template.html');
            file_put_contents('../../index.html', $content);
        } else {
            // Handle case when no data is received
            $errors[] = "No data received!";
            echo json_encode(['errors' => $errors]);
            exit();
        }
    } else {
        // If users table is not empty, return an error
        $errors[] = "Admin user already exists!";
        echo json_encode(['errors' => $errors]);
    }
} catch (PDOException $e) {
    // If a database connection error occurred
    $errors[] = "Database connection error: " . $e->getMessage();
    echo json_encode(['errors' => $errors]);
}
?>
