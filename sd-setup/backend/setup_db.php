<?php
    // Error handling
    $errors = [];

    // Retrieve the raw POST data
    $postData = file_get_contents('php://input');

    // Check if the data is in JSON format
    if (!empty($postData)) {
        // Decode the JSON data to an associative array
        $data = json_decode($postData, true);

        // Access the variables from the JSON data
        $databaseName = $data['database_name'];
        $databaseUsername = $data['database_username'];
        $databasePassword = $data['database_password'];
        $databaseHost = $data['database_host'];

        // Verify database connection and existence of the database name
        try {
            $pdo = new PDO("mysql:host=$databaseHost", $databaseUsername, $databasePassword);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Check if database exists
            $stmt = $pdo->prepare("SHOW DATABASES LIKE :dbname");
            $stmt->bindParam(':dbname', $databaseName);
            $stmt->execute();
            $databaseExists = $stmt->fetch();

            if (!$databaseExists) {
                $errors[] = "Database '$databaseName' does not exist.";
            } else {
                // Select the specified database
                $pdo->exec("USE `$databaseName`");

                // Check if users table exists, if not, create it
                $usersTableCheck = $pdo->query("SHOW TABLES LIKE 'users'");
                if ($usersTableCheck->rowCount() == 0) {
                    $createUsersTable = "CREATE TABLE users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        email VARCHAR(255) NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        role ENUM('admin', 'user') DEFAULT 'user' NOT NULL
                    )";
                    $pdo->exec($createUsersTable);
                }

                // Update config.php file if no errors
                $configContent = "<?php\n";
                $configContent .= "define( 'DB_NAME', '$databaseName' );\n";
                $configContent .= "define( 'DB_USER', '$databaseUsername' );\n";
                $configContent .= "define( 'DB_PASSWORD', '$databasePassword' );\n";
                $configContent .= "define( 'DB_HOST', '$databaseHost' );\n";
                $configContent .= "?>";

                // Write to config.php
                file_put_contents('../../config.php', $configContent);
            }
        } catch (PDOException $e) {
            $errors[] = "Cannot connect to the database, verify the host, username and password.";
        }
    } else {
        // Handle case when no data is received
        $errors[] = "No data received!";
        exit();
    }

    // Return errors or success message
    if (!empty($errors)) {
        echo json_encode(['errors' => $errors]);
    } else {
        echo json_encode(['message' => 'Database setup successful']);
    }
?>
