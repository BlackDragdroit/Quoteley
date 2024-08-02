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
