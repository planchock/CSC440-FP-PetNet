const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db/database");

router.get("/groups", auth, (req, res) => {
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

module.exports = router;