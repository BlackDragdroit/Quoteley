document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
  window.history.back();
}

window.addEventListener("online", () => {
  document.getElementById("netStateIcon").style.backgroundColor = "green";
  document.getElementById("netStateText").innerHTML = "online";
});

window.addEventListener("offline", () => {
  document.getElementById("netStateIcon").style.backgroundColor = "red";
  document.getElementById("netStateText").innerHTML = "offline";
});

export function generateToken(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
