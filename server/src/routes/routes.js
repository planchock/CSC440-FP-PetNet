const express = require("express");
const router = express.Router({ mergeParams: true });

const authRouter = require("./auth");
const userRouter = require("./user");
const feedRouter = require("./feed");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/feed", feedRouter);

module.exports = router;
