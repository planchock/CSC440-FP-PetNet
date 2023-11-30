const express = require("express");
const router = express.Router({ mergeParams: true });

const authRouter = require("./auth");
const postRouter = require("./posts");
const petRouter = require("./pet");
const groupRouter = require("./group");

router.use("/auth", authRouter);

router.use(postRouter);
router.use(petRouter);
router.use(groupRouter);



module.exports = router;
