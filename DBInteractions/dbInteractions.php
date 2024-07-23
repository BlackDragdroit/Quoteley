<?php
// Database credentials
$servername = "web010.wifiooe.at";
$username = "web010";
$password = "X8p59h?e";
$dbname = "web010";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $data = (array) json_decode(file_get_contents('php://input'), TRUE);
    // Get data from POST request
    $username = $data['username'];
    $email = $data['email'];
    $password = $data['password'];
    $type = $data['type'];
    $id = $data['id'] ?? null;
    

    if($type == "u" && $id == null) {
        // Prepare and bind
        $sql = "INSERT INTO users (email, username, passwort) VALUES (?, ?, ?);";
        $stmt = $conn->prepare($sql);
        $stmt -> bind_param("sss", $email, $username, $password);
    } 
    else if ($type == "u"){
        // Prepare and bind
        $stmt = $conn->prepare("UPDATE ? SET ? = ? WHERE id = ?");
        $stmt->bind_param("sssi", $table, $column, $value, $id);
    }
    // if($type == "p" && $id == null) {
    //     // Prepare and bind
    //     $sql = "INSERT INTO `users` (email, username, passwort) VALUES (?, ?, ?)";
    //     $stmt = $conn->prepare($sql);
    //     $stmt -> bind_param("sss", $email, $username, $password);
    // } 
    // else if ($type == "p"){
    //     // Prepare and bind
    //     $stmt = $conn->prepare("UPDATE ? SET ? = ? WHERE id = ?");
    //     $stmt->bind_param("sssi", $table, $column, $value, $id);
    // }

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
    $table = $_GET['table'];
    $column = $_GET['column'];
    $value = $_GET['value'];

    // Prepare and bind
    $stmt = $conn->prepare("SELECT * FROM ? WHERE ? = ?");
    $stmt->bind_param("sss", $table, $column, $value);

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
