<?php
$url = "http://127.0.0.1:8080";
$context = stream_context_create(['http' => ['timeout' => 5]]);
echo "Connecting to $url ...\n";
$response = @file_get_contents($url, false, $context);
if ($response === false) {
    echo "Error: " . print_r(error_get_last(), true) . "\n";
} else {
    echo "Success! Length: " . strlen($response) . "\n";
    echo "First 100 chars: " . substr($response, 0, 100) . "\n";
}
