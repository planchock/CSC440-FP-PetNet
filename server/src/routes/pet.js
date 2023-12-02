const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../db/database");


router.get("/pets", auth, (req, res) => {
    const userId = req.user.user_id;
    db.query(
        'SELECT pet_id, name FROM pet WHERE user_id = ?', [userId]
    ).then(results => {
        const data = results.results.map(item => item);
        return res.status(200).json(data);
    }).catch((err) => {
        console.error(err);
        return res.status(500).json({ msg: "An error occurred" });
      });
});


module.exports = router;