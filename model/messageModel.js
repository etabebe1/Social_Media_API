const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationID: {
      type: String,
    },
    senderID: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);
