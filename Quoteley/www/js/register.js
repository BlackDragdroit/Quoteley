import * as bcrypt from "bcrypt";
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
  window.history.back();
}

document.getElementById("register").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (
    username === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  registerUser(username, email, password);
});

async function registerUser(username, email, password) {
  //Hashing the password
  const hashedPass = hashPassword(password);
  fetch("http://web010.wifiooe.at/quoteley/api/dbInteractions.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: hashedPass,
      type: "u",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        alert("User registered successfully.");
        window.location.href = "login.html";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function hashPassword(password) {
  const saltRounds = 10; // The cost factor controls how much time is needed to calculate a single bcrypt hash. Higher values are more secure but also slower.
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password:", hashedPassword);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
  }
}
