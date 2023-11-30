const express = require("express");
const router = express.Router();
const multer = require("multer");
const PostDAO = require("../db/PostDAO");
const auth = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const postDAO = new PostDAO();

router.post("/post", auth, upload.single('file'), (req, res) => {
    console.log("request:", req.body);
    let request = {
        media_id: null,
        pet_id: req.body.pet_id || null,
        group_id: req.body.group_id || null,
        text: req.body.content,
        caption: req.body.caption,

    }
    const fileBuffer = req.file ? req.file.buffer : null;

    postDAO.sendPost(request, req.user.user_id, fileBuffer).then(response => {
        return res.status(200).json({msg: "success!"});
    }).catch(err => {
        console.error(err);
        return res.status(500).json({error: "internal server error"})
    });
});



module.exports = router;
