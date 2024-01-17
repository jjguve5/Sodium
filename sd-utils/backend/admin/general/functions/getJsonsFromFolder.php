<?php
    // Function to read JSON files from a folder
    function getJsonsFromFolder($folderPath) {
        $pages = [];
        $files = glob($folderPath . '/*.json');

        foreach ($files as $file) {
            $jsonContent = file_get_contents($file);
            $data = json_decode($jsonContent, true);

            // Add error handling if needed
            if ($data !== null) {
                $pages[] = $data;
            }
        }

        return $pages;
    }
?>
