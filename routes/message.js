const express = require("express");
const router = express.Router();

const { sendMessage, getMessage } = require("../controller/message");

router.route("/").post(sendMessage);
router.route("/:conversationID").get(getMessage);

module.exports = router;
