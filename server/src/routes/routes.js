const express = require("express");
const router = express.Router({ mergeParams: true });

const authRouter = require("./auth");
const postRouter = require("./posts");
const petRouter = require("./pet");
const groupRouter = require("./group");
const userRouter = require("./user");
const feedRouter = require("./feed");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/feed", feedRouter);
router.use("/groups", groupRouter);

router.use(postRouter);
router.use(petRouter);

module.exports = router;
