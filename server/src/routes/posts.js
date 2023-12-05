const express = require("express");
const router = express.Router();
const multer = require("multer");
const PostDAO = require("../db/PostDAO");
const auth = require("../middleware/auth");
const db = require("../db/database");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const postDAO = new PostDAO();

router.post("/post", auth, upload.single('file'), (req, res) => {
    let request = {
        media_id: null,
        pet_id: req.body.pet_id || null,
        group_id: req.body.group_id || null,
        text: req.body.content,
        caption: req.body.caption,

    }
    const fileBuffer = req.file ? req.file.buffer : null;

    postDAO.sendPost(request, req.user.user_id, fileBuffer).then(response => {
        return res.status(200).json({ msg: "success!" });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: "internal server error" })
    });
});

router.get("/posts", auth, (req, res) => {
    const userId = req.user.user_id;
    db.query(
        'SELECT * FROM post WHERE user_id = ?', [userId]
    ).then(results => {
        const data = results.results.map(item => item);
        return res.status(200).json(data);
    }).catch((err) => {
        console.error(err);
        return res.status(400).json({ msg: "An error occurred" });
    });
});

router.get("/image", auth, (req, res) => {
    postDAO.getRecentImage().then(img => {
        return res.status(200).send(img);
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: "internal server error" })
    });
});



module.exports = router;
