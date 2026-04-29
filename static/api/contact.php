<?php
/**
 * Relay Contact Form Handler
 * Validates input, sends email, returns JSON response.
 */

header('Content-Type: application/json; charset=utf-8');

// ── Config ──
$recipient = 'relay-support@notetheco.de';
$subject_prefix = '[Relay Contact]';
$allowed_types = ['bug', 'feedback', 'question', 'other'];

// ── CORS (same-origin only) ──
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = ['https://relay-app.dev', 'http://localhost:1313'];
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
}

// ── Only POST ──
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── Rate limiting (simple file-based) ──
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_file = sys_get_temp_dir() . '/relay_contact_' . md5($ip);
if (file_exists($rate_file)) {
    $last = (int)file_get_contents($rate_file);
    if (time() - $last < 60) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'Too many requests. Please wait a minute.']);
        exit;
    }
}

// ── Parse input ──
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) {
    // Fallback to form-encoded
    $data = $_POST;
}

$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$type    = trim($data['type'] ?? 'other');
$message = trim($data['message'] ?? '');

// ── Honeypot (anti-spam) ──
$honeypot = trim($data['website'] ?? '');
if ($honeypot !== '') {
    // Bot detected — pretend success
    echo json_encode(['ok' => true]);
    exit;
}

// ── Validation ──
$errors = [];

if ($name === '' || mb_strlen($name) < 2) {
    $errors[] = 'Name is required (min 2 characters).';
}
if (mb_strlen($name) > 100) {
    $errors[] = 'Name is too long (max 100 characters).';
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}

if (!in_array($type, $allowed_types, true)) {
    $errors[] = 'Invalid message type.';
}

if ($message === '' || mb_strlen($message) < 10) {
    $errors[] = 'Message is required (min 10 characters).';
}
if (mb_strlen($message) > 5000) {
    $errors[] = 'Message is too long (max 5000 characters).';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'errors' => $errors]);
    exit;
}

// ── Sanitize ──
$name    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$type    = htmlspecialchars($type, ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// ── Build email ──
$type_labels = [
    'bug'      => 'Bug Report',
    'feedback' => 'Feedback',
    'question' => 'Question',
    'other'    => 'Other',
];
$type_label = $type_labels[$type] ?? 'Other';
$subject = "$subject_prefix $type_label from $name";

$body = "Type: $type_label\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "IP: $ip\n";
$body .= "Date: " . date('Y-m-d H:i:s T') . "\n";
$body .= "User-Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown') . "\n";
$body .= "\n--- Message ---\n\n";
$body .= $message . "\n";

$headers = "From: noreply@relay-app.dev\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: Relay Contact Form\r\n";

// ── Send ──
$sent = mail($recipient, $subject, $body, $headers);

if ($sent) {
    // Rate limit: record timestamp
    file_put_contents($rate_file, (string)time());
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Failed to send email. Please try again later.']);
}
