const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const secret = process.env.API_SECRET_KEY;

router.post("/login", async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ msg: "Missing required information" });
  }
  
  try {
    const result = await db.query("SELECT * FROM user WHERE username = ?", [req.body.username]);
    if (result.results.length === 0) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }
    
    const user = result.results[0];
    const passwordHash = hashPassword(req.body.password, user.salt);
    
    if (passwordHash !== user.password) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }

    const token = jwt.sign({ user }, secret, { expiresIn: "1h" });
    return res
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3600000),
        secure: true,
      })
      .sendStatus(200);
  } catch (err) {
    return res.status(500).json({ msg: "An error occurred" });
  }
});


router.post("/register", (req, res) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.username ||
    !req.body.password ||
    !req.body.confirmPassword
  ) {
    return res.status(400).json({ msg: "Missing required information" });
  }

  if (req.body.password.length < 8) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 8 characters" });
  }
  const salt = generateSalt();
  const passwordHash = hashPassword(req.body.password, salt);
  
  db.query("INSERT INTO user (first_name, last_name, username, password, salt) VALUES (?, ?, ?, ?, ?)", [req.body.firstName, req.body.lastName, req.body.username, passwordHash, salt])
    .then((result) => {
      return res.status(200).json({ msg: "Account created successfully" });
    })
    .catch((err) => {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ msg: "Username already exists" });
      }
      return res.status(500).json({ msg: "An error occurred" });
    });
});

router.delete("/logout", auth, (req, res) => {
  return res.clearCookie("token").sendStatus(200);
});

router.get("/status", auth, (req, res) => {
  return res.sendStatus(200);
});

function generateSalt(length = 16) {
  return crypto.randomBytes(length).toString("hex");
}

function hashPassword(password, salt) {
  const iterations = 100000;
  const keylen = 64;
  const digest = "sha512";
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    keylen,
    digest
  );
  return derivedKey.toString("hex");
}

module.exports = router;
