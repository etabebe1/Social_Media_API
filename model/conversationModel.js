const mongoose = require("mongoose");

// fro conversation model members array, it contains >= 2 users
// but not < 2
// = 2 for normal conversation
// > 2 for group conversation
// but group conversation feature will be update in the next version
const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("conversations", ConversationSchema);
