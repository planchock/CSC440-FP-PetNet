const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/current", auth, (req, res) => {
  const userId = req.user.user_id;
  return res
  .status(200)
  .json({ msg: userId });
});

module.exports = router;
