document.addEventListener("backbutton", onBackKeyDown, false);
function onBackKeyDown() {
  window.history.back();
}

document.getElementById("register").addEventListener("click", function () {
  window.location.href = "./register.html";
});
