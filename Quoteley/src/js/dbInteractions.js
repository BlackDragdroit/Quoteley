// const URL = "https://web010.wifiooe.at/quoteley/api/dbInteractions.php";
const URL = "http://localhost/dbInteractions.php";
import { generateToken, escapeHTML } from "./utils.js";

export async function registerUser(username, email, password) {
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      username: escapeHTML(username),
      email: escapeHTML(email),
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
    mode: "cors",
    body: JSON.stringify({
      username: escapeHTML(username),
      type: "uid",
    }),
  });

  let data = await response.text();
  return data;
}

export async function authenticateUser(username, password) {
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      username: escapeHTML(username),
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
    mode: "cors",
    body: JSON.stringify({
      uid: uid,
      postContent: escapeHTML(postContent),
      author: escapeHTML(author),
      type: "ap",
    }),
  });
  let data = await response.text();
  return data;
}

export async function deletePost(pid) {
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      pid: pid,
      type: "dp",
    }),
  });
  let data = await response.text();
  return data;
}

export async function setLike(pid) {
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      uid: localStorage.getItem("uid"),
      pid: pid,
      type: "al",
    }),
  });
  let data = await response.text();
  return data;
}

export async function removeLike(pid) {
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      uid: localStorage.getItem("uid"),
      pid: pid,
      type: "rl",
    }),
  });
  let data = await response.text();
  return data;
}

export async function getUserLikes() {
  let uid = localStorage.getItem("uid");
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      uid: uid,
      type: "gul",
    }),
  });
  let data = await response.text();
  return data;
}

export async function getPostLikes(pid) {
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      pid: pid,
      type: "gpl",
    }),
  });
  let data = await response.text();
  return data;
}

export async function getPosts() {
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      type: "gp",
    }),
  });
  let data = await response.json();
  return data;
}

export async function getPost(id) {
  const response = await fetch(URL, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      id: id,
      type: "gpid",
    }),
  });
  let data = await response.json();
  return data;
}

export async function getVerificationToken() {
  const response = await fetch(URL, {
    method: "POST",
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
