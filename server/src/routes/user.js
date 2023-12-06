const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db/database");

router.get("/current", auth, async (req, res) => {
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  try {
    const userInfo = await db.query("SELECT user_id, first_name, last_name, username, profile_pic FROM user WHERE user_id = ?", [userId]);
    const user = userInfo.results;
    
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.status(200).json(user[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred" });
  }
});

router.get("/profile-picture/:user", auth, async (req, res) => {
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  const user = req.params.user; 

  try {
    const pictureInfo = await db.query(
      "SELECT media_url FROM media INNER JOIN user ON user.profile_pic = media.media_id WHERE user.user_id = ?",
      [user]
    );    
    const picture = pictureInfo.results[0].media_url;
    
    return res.status(200).send(picture);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred" });
  }
});

router.get("/:user", auth, async (req, res) => {
  const userId = req.params.user;

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  try {
    const userInfo = await db.query("SELECT user_id, first_name, last_name, username, profile_pic FROM user WHERE user_id = ?", [userId]);
    const user = userInfo.results;
    
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.status(200).json(user[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred" });
  }
});

router.get("/following/list", auth, (req, res) => {
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  db.query("SELECT followee_id FROM follow WHERE follower_id = ?", [userId]
  ).then(results => {
    const data = results.results.map(item => item);
    return res.status(200).json(data);
  }).catch((err) => {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred" });
  });
});

router.post("/follow/:userToFollow", auth, async (req, res) => {
  const userId = req.user.user_id;
  const userToFollow = req.params.userToFollow;

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  if (!userToFollow) {
    return res.status(400).json({ msg: "Missing required information" });
  }

  db.query(
    "INSERT INTO follow (followee_id, follower_id) VALUES (?, ?)",
    [
      userToFollow,
      userId,
    ]
  )
  .then((result) => {
    return res.status(200).json({ msg: "Follow relation created successfully" });
  })
  .catch((err) => {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ msg: "You already follow this user" });
    }
    return res.status(500).json({ msg: "An error occurred" });
  });
});

router.delete("/follow/:userToUnFollow", auth, async (req, res) => {
  const userId = req.user.user_id;
  const userToUnFollow = req.params.userToUnFollow;

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  if (!userToUnFollow) {
    return res.status(400).json({ msg: "Missing required information" });
  }

  db.query("DELETE FROM follow WHERE followee_id = ? AND follower_id = ?", [userToUnFollow, userId]).then(_ => {
    return res.status(200).json({ msg: "Unfollowed successfully" });
  }).catch((err) => {
    console.error(err);
    return res.status(400).json({ msg: "An error occurred" });
  });
});

module.exports = router;
