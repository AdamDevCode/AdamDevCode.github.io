<?php
// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    
    $name = htmlspecialchars($name);
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($message);
    
    
    $to = "adamgoddard15@gmail.com"; 
    $subject = "New Contact Form Submission";
    $body = "Name: $name\n";
    $body .= "Email: $email\n";
    $body .= "Message:\n$message";
    $headers = "From: $email\r\n";
    
    // Send email
    if (mail($to, $subject, $body, $headers)) {
        // Email sent successfully
        echo "Thank you for contacting me, $name. I will get back to you soon";
    } else {
        // Email not sent
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
} else {
    // If form is not submitted, redirect back to the form
    header("Location: index.html");
    exit;
}
?>
