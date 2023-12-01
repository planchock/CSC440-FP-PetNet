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
      "SELECT media.media_url FROM media INNER JOIN user ON user.profile_pic = media.media_id WHERE user.user_id = ?",
      [user]
    );    
    const picture = pictureInfo.results[0].media_url;
    
    return res.status(200).send(picture);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred" });
  }
});

module.exports = router;
