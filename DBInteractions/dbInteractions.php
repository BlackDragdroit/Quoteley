<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    // Handle preflight request
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("HTTP/1.1 200 OK");
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
    $type = $conn->real_escape_string($data['type']); // Don't really need to escape this, but it's good practice (even though I am not doing it most of the time just for the sake of good practice :D)

    switch($type) {
        case "u": addUser($data); break;
        case "ua": authenticateUser($data); break;
        case "uid": getUserID($data); break; 
        case "uu": getUsername($data); break;
        case "ap": addPost($data); break;
        case "gp": getPosts(); break;
        case "gvt": getVerificationToken($data); break;
        case "svt": setVerificcationToken($data); break;
        case "dp": deleteQuote($data); break;
        case "gpid": getPost($data); break;
        case "al": addLike($data); break;
        case "gul": getUserLikes($data); break;
        case "gpl": getPostLikes($data); break;
        case "rl": removeLike($data); break;
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

function addLike($data) {
    global $conn;
    $uid = $conn->real_escape_string($data["uid"]);
    $pid = $conn->real_escape_string($data["pid"]);

    $sql = "INSERT INTO likes (user_id, quote_id) VALUES ('$uid', '$pid')";

    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

function removeLike($data) {
    global $conn;
    $uid = $conn->real_escape_string($data["uid"]);
    $pid = $conn->real_escape_string($data["pid"]);

    $sql = "DELETE FROM likes WHERE user_id = '$uid' AND quote_id = '$pid'";

    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

function getUserLikes($data) {
    global $conn;
    $uid = $conn->real_escape_string($data["uid"]);
    
    $sql = "SELECT quote_id FROM likes WHERE user_id = '$uid'";
    $result = $conn->query($sql);

    if($result) {
        if($result->num_rows > 0) {
            $likes = [];
            while($row = $result->fetch_assoc()) {
                $likes[] = $row;
            }
            echo json_encode($likes);
        } else {
            echo json_encode([]);
        }
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }


}

function getPostLikes($data) {
    global $conn;
    $pid = $conn->real_escape_string($data["pid"]);
    $sql = "SELECT COUNT(*) as likes FROM likes WHERE quote_id = '$pid'";

    $result = $conn->query($sql);
    if($result) {
        if($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode($row);
        } else {
            echo json_encode([]);
        }
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

function deleteQuote($data) {
    global $conn;
    $id = isset($data["pid"]) ? $conn->real_escape_string($data["pid"]) : null;
    $sql = "DELETE FROM quotes WHERE id = '$id'";
    if ($conn->query($sql) === TRUE && $conn->affected_rows > 0) {
        echo "success";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

function getPost($data) {
    global $conn;
    $id = $conn->real_escape_string($data["id"]);

    $sql = "SELECT * FROM quotes WHERE id = '$id'";

    $result = $conn->query($sql);
    if($result) {
        if($result->num_rows > 0) {
            $post = $result->fetch_assoc();
            echo json_encode($post);
        } else {
            echo json_encode([]);
        }
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

function getPosts() {
    global $conn;
    $sql = "SELECT quotes.id, users.username, quotes.user_id, quotes.quote_text, quotes.author, quotes.visibility 
    FROM quotes 
    INNER JOIN users 
    ON quotes.user_id = users.id";

    $result = $conn->query($sql);
    if($result) {
        if($result->num_rows > 0) {
            $posts = [];
            while($row = $result->fetch_assoc()) {
                $posts[] = $row;
            }
            echo json_encode($posts);
        } else {
            echo json_encode([]);
        }
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    

}



function addPost($data) {
    global $conn;
    $uid = $conn->real_escape_string($data["uid"]);
    $postContent = $conn->real_escape_string($data["postContent"]);
    $author = $conn->real_escape_string($data["author"]);
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
    $username = $conn->real_escape_string($data['username']);
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
    $id = $conn->real_escape_string($data['uid']);
    $sql = "SELECT username FROM users WHERE id = '$id'";

    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo $row['username'];
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

function getVerificationToken($data) {
    global $conn;
    $uid = $conn->real_escape_string($data['uid']);
    $sql = "SELECT verification_token FROM users WHERE id = '$uid'";

    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo $row['verification_token'];
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

function setVerificcationToken($data) {
    global $conn;
    $uid = $conn->real_escape_string($data['uid']);
    $token = $data['token'];
    $sql = "UPDATE users SET verification_token = '$token' WHERE id = '$uid'";
    if ($conn->query($sql) === TRUE) {
        echo "success";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    } 
}

?>