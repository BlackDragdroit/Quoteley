async function registerUser(username, email, password) {
  const response = await fetch("http://192.168.64.194/dbInteractions.php", {
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
