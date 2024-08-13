import {
  getUsername,
  addPost,
  getPosts,
  getVerificationToken,
  deletePost,
  getPost,
  setLike,
  removeLike,
  getUserLikes,
  getPostLikes,
} from "./dbInteractions.js";

let infoDIV = document.getElementById("infoDIV");
let postTextArea = document.getElementById("addPostTextArea");
let authorInput = document.getElementById("authorInput");
let postButton = document.getElementById("postButton");

async function startUp() {
  //check if user ID and username are stored in local storage
  //if not, get username from database and store it in local storage
  if (localStorage.getItem("uid") && !localStorage.getItem("username")) {
    localStorage.setItem(
      "username",
      await getUsername(localStorage.getItem("uid"))
    );
  }
  if (localStorage.getItem("uid")) {
    if (localStorage.getItem("token") == null) {
      localStorage.setItem("token", await getVerificationToken());
    } else if (
      localStorage.getItem("token") != (await getVerificationToken())
    ) {
      localStorage.clear();
    }
  }
  document.getElementById("username").innerHTML =
    localStorage.getItem("username");
  await listPosts();
  feather.replace();
}
startUp();

document.getElementById("signout").addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "./index.html";
});

document.getElementById("user").addEventListener("click", onProfileClick);
document.getElementById("addPost").addEventListener("click", onPostClick);

postButton.addEventListener("click", async () => {
  let postContent = postTextArea.value;
  let author = authorInput.value;
  console.log(author);
  console.log(postContent);
  if (
    author == "" ||
    postContent == "" ||
    postContent == "Enter your Quote here..."
  ) {
    setInfoDiv("Please fill in all fields", "red");
    return;
  }
  if (!checkLoginState()) {
    getUID(localStorage.getItem("username")).then((uid) => {
      localStorage.setItem("uid", uid);
    });
    if (localStorage.getItem("token") != (await getVerificationToken())) {
      localStorage.clear();
      return;
    }
  }
  let result = await addPost(postContent, author, localStorage.getItem("uid"));
  console.log(result);
  if (result == "success") {
    setInfoDiv("Post added successfully", "green");
    document.getElementById("addPostPopUpContainer").style.display = "none";
    postTextArea.value = "";
    authorInput.value = "";
    previewQuote.innerHTML = "Enter your Quote here...";
    startUp();
  } else {
    setInfoDiv("Error adding post", "red");
  }
});

function setInfoDiv(message, color) {
  infoDIV.style.color = color;
  infoDIV.style.border = "solid " + color;
  infoDIV.innerHTML = message;
  infoDIV.style.visibility = "visible";
  setTimeout(() => {
    infoDIV.style.visibility = "hidden";
  }, 3000);
}

//List Posts
async function listPosts() {
  if (!checkLoginState()) {
    localStorage.clear();
  }
  let likedPosts = await getUserLikes();
  let contentDiv = document.getElementById("contentDIV");
  contentDiv.innerHTML = "";

  await getPosts().then(async (posts) => {
    if (posts.length == 0) {
      let postDiv = document.createElement("div");
      postDiv.classList.add("post");

      let quoteDiv = document.createElement("div");
      quoteDiv.classList.add("quote");
      quoteDiv.innerHTML = "It's empty here :( </br> </br> - Quoteley";

      postDiv.appendChild(quoteDiv);

      contentDiv.appendChild(postDiv);
      return;
    }
    //Creating Elements for each post
    for (let i = 0; i < posts.length; i++) {
      let postDiv = document.createElement("div");
      postDiv.classList.add("post");

      let quoteDiv = document.createElement("div");
      quoteDiv.classList.add("quote");
      quoteDiv.innerHTML =
        posts[i].quote_text + "<br><br>" + "- " + posts[i].author;

      let subPostInfoDiv = document.createElement("div");
      subPostInfoDiv.classList.add("subPostInfo");
      let div1 = document.createElement("div");
      div1.classList.add("likeCommDIV");
      let likeButton = document.createElement("i");
      likeButton.classList.add("likeButton");
      likeButton.setAttribute("data-feather", "heart");
      if (likedPosts.includes(posts[i].id)) {
        likeButton.classList.add("liked");
      }
      likeButton.name = posts[i].id;
      likeButton.classList.add("noPointerEvents");
      let likeDiv = document.createElement("div");
      likeDiv.name = posts[i].id;
      likeDiv.appendChild(likeButton);

      likeDiv.addEventListener("click", async (event) => {
        if (checkLoginState()) {
          console.log(event.target.firstChild);
          if (event.target.firstChild.classList.contains("liked")) {
            await removeLike(likeDiv.name).then((result) => {
              if (result == "success") {
                event.target.firstChild.classList.remove("liked");
                console.log("removed");
              } else {
                setInfoDiv("Error unliking post", "red");
                console.log(result);
              }
            });
          } else {
            console.log("liked");
            await setLike(likeDiv.name).then((result) => {
              if (result == "success") {
                event.target.firstChild.classList.add("liked");
              } else {
                setInfoDiv("Error liking post", "red");
                console.log(result);
              }
            });
          }
        }
      });

      let commButton = document.createElement("i");
      commButton.setAttribute("data-feather", "message-square");
      commButton.classList.add("commentButton");
      commButton.name = posts[i].id;
      let commDiv = document.createElement("div");
      commDiv.appendChild(commButton);

      //Todo: Add comment functionality
      commDiv.addEventListener("click", async () => {});

      div1.appendChild(likeDiv);
      div1.appendChild(commDiv);

      let div2 = document.createElement("div");
      div2.innerHTML = posts[i].username;

      let div3 = document.createElement("div");
      div3.classList.add("deleteButtonDIV");

      postDiv.appendChild(quoteDiv);
      postDiv.appendChild(subPostInfoDiv);

      contentDiv.appendChild(postDiv);
      //Check if Post is by the logged in user
      if (
        localStorage.getItem("uid") == posts[i].user_id &&
        (await checkLoginState())
      ) {
        let deleteButton = document.createElement("i");
        deleteButton.classList.add = "deleteButton";
        deleteButton.setAttribute("data-feather", "trash-2");
        deleteButton.name = posts[i].id;
        div3.addEventListener("click", async () => {
          let pID = await getPost(deleteButton.name);
          if (pID) {
            if (
              pID.user_id != localStorage.getItem("uid") &&
              checkLoginState()
            ) {
              setInfoDiv("You can't delete someone else's post", "red");
              return;
            }
          }
          if (!confirm("Are you sure you want to delete this post?")) return;
          let result = await deletePost(deleteButton.name);
          console.log(result);
          if (result == "success") {
            setInfoDiv("Post deleted successfully", "green");
            startUp();
          } else {
            setInfoDiv("Error deleting post", "red");
          }
        });
        div3.appendChild(deleteButton);
      }
      subPostInfoDiv.appendChild(div1);
      subPostInfoDiv.appendChild(div2);
      subPostInfoDiv.appendChild(div3);

      if (i == posts.length - 1) {
        contentDiv.appendChild(document.createElement("br"));
        contentDiv.appendChild(document.createElement("br"));
      }
    }
  });
}

function startBlinkingCursor() {
  blinkingCursorActive = true;
  const cursor = document.getElementById("blinkingCursor");
  setInterval(() => {
    cursor.style.visibility =
      cursor.style.visibility === "hidden" ? "visible" : "hidden";
  }, 500); // Toggle visibility every 500ms
}
function stopBlinkingCursor() {
  clearInterval();
}

//End of Area

async function onPostClick() {
  let previewQuote = document.getElementById("previewQuote");
  let textArea = document.getElementById("addPostTextArea");
  let blinkingCursorActive = false;
  textArea.value = "";
  previewQuote.innerHTML = "Enter your Quote here...";
  textArea.onfocus = () => {
    console.log("focus");
  };

  previewQuote.addEventListener("click", () => {
    textArea.focus();
    previewQuote.innerHTML = '<span id="blinkingCursor">|</span>';
    startBlinkingCursor();
  });

  textArea.addEventListener("input", () => {
    if (blinkingCursorActive) {
      stopBlinkingCursor();
      blinkingCursorActive = false;
    }
    if (isNaN(textArea.value) || textArea.value === "") {
      previewQuote.innerHTML = "Enter your Quote here...";
    }
    previewQuote.innerText = textArea.value;
  });

  if (await checkLoginState()) {
    let postContainer = document.getElementById("addPostPopUpContainer");
    if (postContainer.style.display == "none") {
      postContainer.style.display = "flex";
      document.getElementById("previewSubPost").innerHTML =
        localStorage.getItem("username");
      setTimeout(() => {
        document.addEventListener("click", hidePostPopUp);
      }, 1000);
    } else {
      postContainer.style.display = "none";
    }
  } else {
    setInfoDiv("Please log in to post", "red");
  }
}

function hideUserPopUp(event) {
  if (!event.target.closest("#userPopUpContainer")) {
    document.getElementById("userPopUpContainer").style.display = "none";
  }
  document.removeEventListener("click", hideUserPopUp);
}

function hidePostPopUp(event) {
  if (!event.target.closest("#addPostPopUpContainer")) {
    document.getElementById("addPostPopUpContainer").style.display = "none";
  }
  document.removeEventListener("click", hidePostPopUp);
}

async function checkLoginState() {
  let uid = localStorage.getItem("uid");
  if (uid) {
    if (localStorage.getItem("token") == (await getVerificationToken()))
      return true;
  } else {
    return false;
  }
}

async function onProfileClick() {
  //if logged in -> show div with user info
  //if not logged in -> show default div
  let defaultPopUpContent = document.getElementById("defaultPopUpContent");
  let userInfoPopUpContent = document.getElementById("userInfoPopUpContent");
  let userPopUpContainer = document.getElementById("userPopUpContainer");
  if (await checkLoginState()) {
    defaultPopUpContent.style.visibility = "hidden";
    defaultPopUpContent.style.position = "absolute";
    userInfoPopUpContent.style.visibility = "visible";
    userInfoPopUpContent.style.position = "relative";
    if (userPopUpContainer.style.display == "none") {
      document.getElementById("userPopUpContainer").style.display = "flex";
      setTimeout(() => {
        document.addEventListener("click", hideUserPopUp);
      }, 1000);
    } else {
      document.getElementById("userPopUpContainer").style.display = "none";
    }
  } else {
    defaultPopUpContent.style.visibility = "visible";
    defaultPopUpContent.style.position = "relative";
    userInfoPopUpContent.style.visibility = "hidden";
    userInfoPopUpContent.style.position = "absolute";

    if (userPopUpContainer.style.display == "none") {
      document.getElementById("userPopUpContainer").style.display = "flex";
    } else {
      document.getElementById("userPopUpContainer").style.display = "none";
    }
  }
}
