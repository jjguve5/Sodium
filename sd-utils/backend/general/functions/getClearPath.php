<?php
function getClearPath() {
    $currentPath = realpath(dirname(__FILE__));
    $sdUtilsPos = strpos($currentPath, 'sd-utils');

    if ($sdUtilsPos !== false) {
        // Remove everything from 'sd-utils' onwards
        $clearPath = substr($currentPath, 0, $sdUtilsPos);
        return $clearPath;
    }

    return $currentPath;
}
?>
