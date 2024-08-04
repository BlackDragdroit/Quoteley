import {
  getUID,
  authenticateUser,
  getVerificationToken,
  setVerificationToken,
} from "./dbInteractions.js";
let username = document.getElementById("username");
let password = document.getElementById("password");
let infoDIV = document.getElementById("infoDIV");
document.getElementById("register").addEventListener("click", function () {
  window.location.href = "./register.html";
});

document.getElementById("login").addEventListener("click", () => {
  console.log("login");
  if (username.value === "" || password.value === "") {
    infoDIV.style.color = "darkgray";
    infoDIV.style.border = "solid darkgray";
    infoDIV.innerHTML = "Please fill in all fields.";
    infoDIV.style.visibility = "visible";
    return;
  }
  loginUser(username.value, password.value);
});

async function loginUser(username, password) {
  let data = await authenticateUser(username, password);
  if (data == "success") {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("uid", await getUID(username));
    if ((await setVerificationToken()) == "success") {
      let token = await getVerificationToken();
      console.log(token);
      localStorage.setItem("token", token);
    }
    window.location.href = "../../index.html";
  } else {
    infoDIV.style.color = "red";
    infoDIV.style.border = "solid red";
    infoDIV.innerHTML = "Invalid username or password.";
    infoDIV.style.visibility = "visible";
  }
}
