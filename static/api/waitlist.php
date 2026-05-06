<?php
/**
 * Relay Waitlist — Email Collection
 * Stores emails in a CSV file + sends confirmation.
 */

header('Content-Type: application/json; charset=utf-8');

$data_dir = __DIR__ . '/../data';
$csv_file = $data_dir . '/waitlist.csv';
$notify_to = 'support@relay-app.dev';

// CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://relay-app.dev', 'http://localhost:1313'];
if (in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Rate limit
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_file = sys_get_temp_dir() . '/relay_waitlist_' . md5($ip);
if (file_exists($rate_file) && (time() - (int)file_get_contents($rate_file)) < 30) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Please wait before trying again.']);
    exit;
}

// Parse
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!$input) $input = $_POST;

$email = trim($input['email'] ?? '');
$honeypot = trim($input['website'] ?? '');

// Honeypot
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// Validate
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Please enter a valid email address.']);
    exit;
}

// Ensure data dir exists
if (!is_dir($data_dir)) {
    mkdir($data_dir, 0750, true);
}

// Check duplicate
$exists = false;
if (file_exists($csv_file)) {
    $handle = fopen($csv_file, 'r');
    while (($row = fgetcsv($handle)) !== false) {
        if (isset($row[0]) && strtolower($row[0]) === strtolower($email)) {
            $exists = true;
            break;
        }
    }
    fclose($handle);
}

if ($exists) {
    echo json_encode(['ok' => true, 'already' => true]);
    file_put_contents($rate_file, (string)time());
    exit;
}

// Store
$handle = fopen($csv_file, 'a');
if (!$handle) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not save. Please try again.']);
    exit;
}
fputcsv($handle, [$email, date('Y-m-d H:i:s'), $ip]);
fclose($handle);

// Count total signups
$total = 0;
if (file_exists($csv_file)) {
    $total = count(file($csv_file));
}

// Notify
$subject = "[Relay Waitlist] New signup (#$total)";
$body = "New waitlist signup:\n\nEmail: $email\nDate: " . date('Y-m-d H:i:s T') . "\nIP: $ip\nTotal signups: $total\n";
$headers = "From: noreply@relay-app.dev\r\nReply-To: $email\r\n";
mail($notify_to, $subject, $body, $headers);

// Rate limit
file_put_contents($rate_file, (string)time());

echo json_encode(['ok' => true, 'count' => $total]);
