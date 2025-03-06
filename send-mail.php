<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $subject = $_POST['subject'] ?? '';
    $message = $_POST['message'] ?? '';

    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        $response['message'] = 'All fields are required.';
        echo json_encode($response);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email address.';
        echo json_encode($response);
        exit;
    }

    try {
        $mail = new PHPMailer(true);
        
        // SMTP Settings
        $mail->isSMTP();
        $mail->Host = 'smtp-relay.sendinblue.com';
        $mail->SMTPAuth = true;
        $mail->Username = '87542f001@smtp-brevo.com'; // Replace with your Brevo login email
        $mail->Password = '6QRCU14JtcZh2DAm'; // Replace with your Brevo SMTP API Key
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Email Details
        $mail->setFrom('87542f001@smtp-brevo.com', 'Junaid Khan');
        $mail->addAddress('itxjunaid22@gmail.com'); // Receiver email
        $mail->addReplyTo($email, $name);

        $mail->Subject = "New Contact Form Message: $subject";
        $mail->Body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

        if ($mail->send()) {
            $response['success'] = true;
            $response['message'] = 'Your message has been sent successfully!';
        } else {
            $response['message'] = 'Failed to send the message. Please try again.';
        }
    } catch (Exception $e) {
        $response['message'] = "Mailer Error: {$mail->ErrorInfo}";
    }
}

echo json_encode($response);
?>
