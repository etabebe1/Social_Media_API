const mongoose = require("mongoose");

const POSTSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      max: 500,
    },

    image: {
      type: String,
    },

    likes: {
      type: Array,
      default: [],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("post", POSTSchema);
