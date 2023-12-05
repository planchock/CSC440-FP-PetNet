const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db/database");
const multer = require('multer');


const storage = multer.memoryStorage(); // Use memory storage for storing the file as a buffer
const upload = multer({ storage: storage });

router.get("/", auth, (req, res) => {
    const userId = req.user.user_id;
    db.query(
        'SELECT gr.group_id, group_name FROM `group` AS gr JOIN group_member AS gm ON gm.group_id = gr.group_id WHERE gm.user_id = ?', [userId]
    ).then(results => {
        const data = results.results.map((item) => (item));
        return res.status(200).json(data);
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ msg: "An error occurred" });
    });
});

router.get("/current", async (req, res) => {
    try {
      const groups = await db.query("SELECT * FROM petnet.group");
      return res.status(200).json(groups);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Unable to retrieve groups" });
    }
  });
  

router.post('/new', upload.single('group_pic'), async (req, res) => {
    try {
        const { group_name, group_desc, admin_id } = req.body;
        const fileBuffer = req.file ? req.file.buffer : null;
        const result = await db.query('CALL create_group(?, ?, ?, ?)', [group_name, group_desc, admin_id, fileBuffer]);
        const groupId = result.results.insertId;
        return res.status(200).json({ msg: 'Group created successfully', group_id: groupId });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ msg: "Unable to create group" });
    }
});

// Get the group information belonging to the group number
router.get("/:groupId", async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const group = await db.query("SELECT * FROM petnet.group WHERE group_id = ?", [groupId]);

      if (group.length === 0) {
        return res.status(404).json({ msg: "Group not found" });
      }

      var pic = group.results[0].group_pic
      if (pic !== null){
        pic = await db.query("SELECT media_url FROM media WHERE media_id = ?", [group.results[0].group_pic]);
      }
      
      const formattedGroup = {
        group_id: group.results[0].group_id,
        group_pic: pic,
        group_name: group.results[0].group_name,
        group_desc: group.results[0].group_desc,
        admin_id: group.results[0].admin_id,
      };
      
      return res.status(200).json(formattedGroup);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Unable to retrieve group members" });
      }
  });

// Get the member belonging to that groups number 
router.get("/members/:groupId", async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const members = await db.query("SELECT user_id FROM group_member WHERE group_id = ?", [groupId]);

      if (!members || members.length === 0) {
        console.log("enters");
        return res.status(200).json();
      }
      const formattedMembers = {
        members: members.results
      };
      
      return res.status(200).json(formattedMembers);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Unable to retrieve group members" });
    }
  });

// Get the member belonging to that groups number 
router.get("/posts/:groupId", async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const posts = await db.query("SELECT * FROM post WHERE group_id = ?", [groupId]);

      if (!posts || posts.length === 0) {
        console.log("enters");
        return res.status(200).json();
      }
      const formattedPosts = {
        posts: posts.results
      };
      
      return res.status(200).json(formattedPosts);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Unable to retrieve group posts" });
    }
  });

// Get the member belonging to that groups number 
router.post("/join", async (req, res) => {
    try {
      const groupId = req.body.groupId;
      const userId = req.body.userId
      await db.query("INSERT INTO group_member (group_id, user_id) VALUES (?, ?)", [groupId, userId]);
      return res.status(200).json({ msg: "Added user to group" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Unable to add user to group" });
    }
  });
  
  



module.exports = router;