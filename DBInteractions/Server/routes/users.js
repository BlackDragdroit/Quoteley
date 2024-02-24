import express from "express";

const router = express.Router();

const users = [
  {
    username: "Jonathan",
    password: "pass",
    theme: "dark",
    nsfw: false,
  },
];

router.get("/", (req, res) => res.send(users));

export default router;
