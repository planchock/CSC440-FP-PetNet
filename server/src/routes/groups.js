const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db/database");

router.get("/current", async (req, res) => {
  try {
    const groups = await db.query("SELECT * FROM petnet.group");
    return res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Unable to retrieve groups" });
  }
});

router.post('/new', async (req, res) => {
    try {
      console.log(req.body);
      const { group_pic, group_name, group_desc, admin_id } = req.body;
      const existingGroup = await db.query('SELECT * FROM petnet.group WHERE LOWER(group_name) = LOWER(?)', [group_name]);
      if (existingGroup.length > 0) {
        return res.status(400).json({ msg: 'Group with the same name already exists.' });
      }
      await db.query('INSERT INTO petnet.group (group_name, group_desc, admin_id) VALUES (?, ?, ?)', [group_name, group_desc, 1]);
      return res.status(200).json({ msg: 'Group created successfully' });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ msg: "Unable to create group" });
    }
});

module.exports = router;