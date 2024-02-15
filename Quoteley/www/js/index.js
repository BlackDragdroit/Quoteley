//Every time the app starts up, this function will be called
function startUp() {
  //Check if logged in
  if (true) {
  } else {
  }
}
startUp();

document.getElementById("user").addEventListener("click", function () {
  //if logged in -> show div with user info
  //if not logged in -> show default div
  if (false) {
    if (document.getElementById("userInfoPopUp").style.display == "none") {
      document.getElementById("userInfoPopUp").style.display = "flex";
    } else {
      document.getElementById("userInfoPopUp").style.display = "none";
    }
  } else {
    if (document.getElementById("defaultUserPopUp").style.display == "none") {
      document.getElementById("defaultUserPopUp").style.display = "flex";
    } else {
      document.getElementById("defaultUserPopUp").style.display = "none";
    }
  }
});
