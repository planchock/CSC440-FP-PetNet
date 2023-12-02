const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db/database");

router.get("/groups", auth, (req, res) => {
    const userId = req.user.user_id;
    db.query(
        'SELECT group_id, group_name FROM `group` WHERE admin_id = ?', [userId]
    ).then(results => {
        const data = results.results.map((item) => (item));
        console.log(results.results);
        return res.status(200).json(data);
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ msg: "An error occurred" });
    });
});

module.exports = router;