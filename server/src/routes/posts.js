const express = require("express");
const router = express.Router();
const PostDAO = require("../db/PostDAO");
const auth = require("../middleware/auth");

const postDAO = new PostDAO();

router.post("/post", auth, (req, res) => {
    console.log("request:", req.body);
    let request = {
        media_id: null,
        pet_id: req.body.pet_id,
        group_id: req.body.group_id,
        text: req.body.content,
        caption: req.body.caption,

    }
    postDAO.sendPost(request, req.user.user_id, req.body.media).then(post => {
        return res.status(200);
    }).catch(err => {
        console.error(err);
        return res.status(500).json({error: "internal server error"})
    });
});

router.get("/test", auth, (req, res) => {
    console.log(req.user);
    return res;
});



module.exports = router;
