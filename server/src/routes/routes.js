const express = require("express");
const router = express.Router({ mergeParams: true });

const authRouter = require("./auth");
const postRouter = require("./posts");

router.use("/auth", authRouter);

router.use(postRouter);



module.exports = router;
