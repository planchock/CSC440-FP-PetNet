const express = require("express");
const router = express.Router();

const secret = process.env.API_SECRET_KEY;

router.get("/", (req, res) => {
  res.send("auth");
});

router.post("/login", (req, res) => {
  res.send("login");
});

router.post("/register", (req, res) => {
  res.send("register");
});

router.delete("/logout", (req, res) => {
  res.send("logout");
});

module.exports = router;
