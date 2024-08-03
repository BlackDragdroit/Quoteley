import { getUsername, addPost, getPosts } from "./dbInteractions";
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
    document.getElementById("username").innerHTML =
      localStorage.getItem("username");
  }
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
    infoDIV.innerHTML = "Please fill in all fields";
    infoDIV.style.color = "red";
    infoDIV.style.border = "solid red";
    infoDIV.style.visibility = "visible";
    setTimeout(() => {
      infoDIV.style.visibility = "hidden";
    }, 3000);
    return;
  }

  let result = await addPost(postContent, author, localStorage.getItem("uid"));
  console.log(result);
  if (result == "success") {
    infoDIV.style.color = "green";
    infoDIV.style.border = "solid green";
    infoDIV.innerHTML = "Post added successfully";
    infoDIV.style.visibility = "visible";
    document.getElementById("addPostPopUpContainer").style.display = "none";
    postTextArea.value = "";
    authorInput.value = "";
    previewQuote.innerHTML = "Enter your Quote here...";
    setTimeout(() => {
      infoDIV.style.visibility = "hidden";
    }, 3000);
  } else {
    infoDIV.style.color = "red";
    infoDIV.style.border = "solid red";
    infoDIV.innerHTML = "Error adding post";
    infoDIV.style.visibility = "visible";
    setTimeout(() => {
      infoDIV.style.visibility = "hidden";
    }, 3000);
  }
});

//List Posts
async function listPosts() {
  let contentDiv = document.getElementById("contentDIV");

  // <div class="post">
  //   <div class="quote">
  //     The greatest glory in living lies not in never falling, but in rising
  //     every time we fall </br> </br>
  //     - Nelson Mandela
  //   </div>
  //   <div class="subPostInfo">username </div>
  // </div>

  await getPosts().then((posts) => {
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
    for (let i = 0; i < posts.length; i++) {
      let postDiv = document.createElement("div");
      postDiv.classList.add("post");

      let quoteDiv = document.createElement("div");
      quoteDiv.classList.add("quote");
      quoteDiv.innerHTML =
        posts[i].quote_text + "<br><br>" + "- " + posts[i].author;

      let subPostInfoDiv = document.createElement("div");
      subPostInfoDiv.classList.add("subPostInfo");
      subPostInfoDiv.innerHTML = posts[i].username;

      postDiv.appendChild(quoteDiv);
      postDiv.appendChild(subPostInfoDiv);

      contentDiv.appendChild(postDiv);

      if (i == posts.length - 1) {
        contentDiv.appendChild(document.createElement("br"));
        contentDiv.appendChild(document.createElement("br"));
      }
    }
  });
}
listPosts();

//Area: Live Preview of Quote while creating a post
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
  previewQuote.innerHTML = textArea.value;
});

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

function onPostClick() {
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

function onProfileClick() {
  //if logged in -> show div with user info
  //if not logged in -> show default div
  let defaultPopUpContent = document.getElementById("defaultPopUpContent");
  let userInfoPopUpContent = document.getElementById("userInfoPopUpContent");
  let userPopUpContainer = document.getElementById("userPopUpContainer");
  if (localStorage.getItem("loggedIn")) {
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
