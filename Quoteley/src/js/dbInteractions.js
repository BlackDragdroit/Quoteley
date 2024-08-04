const URL = "http://192.168.0.156/dbInteractions.php";
import { generateToken } from "./utils.js";

export async function registerUser(username, email, password) {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      username: username,
      email: email,
      password: password,
      type: "u",
    }),
  });
  const data = await response.text();
  return data;
}

export async function getUID(username) {
  const response = await fetch(URL, {
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
}

export async function authenticateUser(username, password) {
  const response = await fetch(URL, {
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
  return data;
}

export async function getUsername(uid) {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      uid: uid,
      type: "uu",
    }),
  });
  let data = await response.text();
  return data;
}

export async function addPost(postContent, author, uid) {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      uid: uid,
      postContent: postContent,
      author: author,
      type: "ap",
    }),
  });
  let data = await response.text();
  return data;
}

export async function getPosts() {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      type: "gp",
    }),
  });
  let data = await response.json();
  return data;
}

export async function getVerificationToken() {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      type: "gvt",
      uid: localStorage.getItem("uid"),
    }),
  });
  let data = await response.text();
  return data;
}

export async function setVerificationToken() {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      type: "svt",
      uid: localStorage.getItem("uid"),
      token: generateToken(50),
    }),
  });
  let data = await response.text();
  return data;
}
