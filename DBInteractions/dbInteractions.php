<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    exit(0);
}
// Database credentials
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "coding";

// Create connection
global $conn;
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $response = [];
    $data = (array) json_decode(file_get_contents('php://input'), TRUE);
    $type = $conn->real_escape_string($data['type']);

    switch($type) {
        case "u": addUser($data); break;
        case "ua": authenticateUser($data); break;
        case "uid": getUserID($data); break; 
        case "uu": getUsername($data); break;
        case "ap": addPost($data); break;
        case "gp": getPosts(); break;
        default: exit;
    }
    
}

else if($_SERVER["REQUEST_METHOD"] == "GET") {
    $data = (array) json_decode(file_get_contents('php://input'), TRUE);
    $type = $data['type'];

    switch($type) {
        case "uid": getUserID($data); break; 
        default: exit;
    }
}

function getPosts() {
    global $conn;
    $sql = "SELECT quotes.id, users.username, quotes.quote_text, quotes.author, quotes.visibility 
    FROM quotes 
    INNER JOIN users 
    ON quotes.user_id = users.id";

    $result = $conn->query($sql);
    if($result->num_rows > 0) {
        $posts = [];
        while($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }
        echo json_encode($posts);
    } else {
        echo json_encode([]);
    }

}

function addPost($data) {
    global $conn;
    $uid = $data["uid"];
    $postContent = $data["postContent"];
    $author = $data["author"];
    $visibility = isset($data["visibility"]) ? $data["visibility"] : "public";

    $sql = "INSERT INTO quotes (user_id, quote_text, author, visibility) VALUES ('$uid', '$postContent', '$author', '$visibility')";

    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

function getUserID($data) {
    global $conn;
    $username = $data['username'];
    $sql = "SELECT id FROM users WHERE username = '$username'";

    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo $row['id'];
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
function addUser($data) {
    global $conn;
    $username = trim($conn->real_escape_string($data['username']));
    $email = trim(strtolower($conn->real_escape_string($data['email'])));
    $password = $conn->real_escape_string($data['password']);
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "SELECT username, email FROM users WHERE username = '$username'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            echo "u-exists";
            exit;
        }

        $sql = "SELECT username, email FROM users WHERE email = '$email'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            echo "e-exists";
            exit;
        }

        $sql = "INSERT INTO users (email, username, password) VALUES ('$email', '$username', '$hashedPassword')";

        if ($conn->query($sql) === TRUE) {
            echo "success";
            exit;
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
            exit;
        }
        exit;
}

function authenticateUser($data) {
    global $conn;
    $username = trim($conn->real_escape_string($data['username']));
    $password = $conn->real_escape_string($data['password']);

    $sql = "SELECT username, password FROM users WHERE username = '$username'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            if (password_verify($password, $row['password'])) {
                echo "success";
                exit;
            } else {
                exit;
            }
        } else {
            exit;
        }
}


function getUsername($data) {
    global $conn;
    $id = $data['uid'];
    $sql = "SELECT username FROM users WHERE id = '$id'";

    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo $row['username'];
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}