import { getUID } from "./dbInteractions.js";
let username = document.getElementById("username");
let password = document.getElementById("password");
let infoDIV = document.getElementById("infoDIV");
document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
  window.history.back();
}

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
  const response = await fetch("http://192.168.64.194/dbInteractions.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      username: username,
      password: password,
      type: "ua",
    }),
  });
  let data = await response.text();
  console.log("Success:", data);
  if (data == "success") {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("uid", getUID(username));
    window.location.href = "./mainPage.html";
  } else {
    infoDIV.style.color = "red";
    infoDIV.style.border = "solid red";
    infoDIV.innerHTML = "Invalid username or password.";
    infoDIV.style.visibility = "visible";
  }
}

getUID = async (username) => {
  const response = await fetch("http://192.168.64.194:80/dbInteractions.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      username: username,
      type: "uid",
    }),
  });

  let data = await response.text();
  return data;
};
