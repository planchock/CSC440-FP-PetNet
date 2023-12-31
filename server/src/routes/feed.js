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
    // Get the users that the current user follows
    const followees = await db.query("SELECT followee_id FROM follow WHERE follower_id = ?", [userId]);
    const followeeIds = followees.results.map(followee => followee.followee_id);

    // Include the current user's id in the list of user ids
    followeeIds.push(userId);

    // Retrieve posts from the users the current user follows and the current user
    const result = await db.query(`
    SELECT 
      post.*, 
      media.media_url as media, 
      pet.name as pet, 
      user.username, 
      user.first_name, 
      user.last_name,
      \`group\`.group_name,
      user_media.media_url as user_media
    FROM post
    LEFT JOIN media ON post.media_id = media.media_id
    LEFT JOIN pet ON post.pet_id = pet.pet_id
    LEFT JOIN user ON post.user_id = user.user_id
    LEFT JOIN \`group\` ON post.group_id = \`group\`.group_id
    LEFT JOIN media AS user_media ON user.profile_pic = user_media.media_id
    WHERE post.user_id IN (?)`, [followeeIds]);

    const feed = result.results;

    return res.status(200).json(feed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred" });
  }
});

router.get("/groups", auth, async (req, res) => {
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  try {
    const groupsUserIsIn = await db.query("SELECT group_id FROM group_member WHERE user_id = ?", [userId]);
  
    // Extract group IDs from the result
    const groupIds = groupsUserIsIn.results.map(group => group.group_id);
  
    if (groupIds.length === 0) {
      // No groups found for the user
      return res.status(200).json([]);
    }
  
    const result = await db.query(`
      SELECT * FROM \`group\`
      WHERE group_id IN (${groupIds.join(',')})`);
  
    const groups = result.results;
  
    return res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred" });
  }
  
});

router.get("/comments/:post_id", auth, async (req, res) => {
  const userId = req.user.user_id;
  const postId = req.params.post_id; 

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  try {
    const commentResults = await db.query(
      "SELECT comment.*, user.username FROM comment INNER JOIN user ON comment.user_id = user.user_id WHERE comment.post_id = ?",
      [postId]
    );  
    // Extract group IDs from the result
    const comments = commentResults.results;
  
    if (comments.length === 0) {
      // No groups found for the user
      return res.status(200).json([]);
    }
  
    return res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred" });
  }
});

router.post("/comments/:post_id", auth, async (req, res) => {
  const userId = req.user.user_id;
  const postId = req.params.post_id; 

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  if (!req.body.text) {
    return res.status(400).json({ msg: "Missing required information" });
  }

  try {
    const result = await db.query('CALL create_comment(?, ?, ?)',
    [req.body.text, postId, userId]);
    return res.status(200).json({ msg: "Added comment" });
  } catch(err) {
    return res.status(500).json({ msg: "An error occurred" });
  }
});

router.get("/picture/:post", auth, async (req, res) => {
  const userId = req.user.user_id;

  if (!userId) {
    return res.status(400).json({ msg: "No signed-in user" });
  }

  const postId = req.params.post; 

  try {
    const pictureInfo = await db.query(
      "SELECT media_url FROM media INNER JOIN post ON post.media_id = media.media_id WHERE post.post_id = ?",
      [postId]
    );    
    const picture = pictureInfo.results[0].media_url;
    
    return res.status(200).send(picture);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "An error occurred" });
  }
});


module.exports = router;
