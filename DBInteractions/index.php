<?php
// Database credentials
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "database";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get data from POST request
    $column = $_POST['column'];
    $value = $_POST['value'];
    $id = $_POST['id'];

    // Prepare and bind
    $stmt = $conn->prepare("UPDATE your_table SET $column = ? WHERE id = ?");
    $stmt->bind_param("si", $value, $id);

    // Execute the query
    if ($stmt->execute()) {
        echo "Record updated successfully";
    } else {
        echo "Error updating record: " . $stmt->error;
    }

    $stmt->close();
}
else if($_SERVER["REQUEST_METHOD"] == "GET") {
    // Get data from GET request
    $column = $_GET['column'];
    $value = $_GET['value'];

    // Prepare and bind
    $stmt = $conn->prepare("SELECT * FROM your_table WHERE ? = ?");
    $stmt->bind_param("si", $column, $value);

    // Execute the query
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();

    // Fetch the result
    $row = $result->fetch_assoc();

    // Return the result
    echo json_encode($row);

    $stmt->close();
}
else {
    echo "Invalid request";
}

$conn->close();
?>
