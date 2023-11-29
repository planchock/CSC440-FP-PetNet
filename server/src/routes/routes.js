const express = require("express");
const router = express.Router({ mergeParams: true });

const authRouter = require("./auth");
const groupsRouter = require("./groups");


router.use("/auth", authRouter);
router.use("/groups", groupsRouter);

module.exports = router;
