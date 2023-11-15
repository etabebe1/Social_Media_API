const express = require("express");
const router = express.Router();

const {
  openConversation,
  getConversation,
} = require("../controller/conversation");

router.route("/").post(openConversation);
router.route("/:id").get(getConversation);

module.exports = router;
