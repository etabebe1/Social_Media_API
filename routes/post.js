const express = require("express");
const router = express.Router();

const {
  getTimelinePosts,
  getProfilePosts,
  createPost,
  deletePost,
  updatePost,
  likePost,
  getPost,
} = require("../controller/post");

router.route("/profile/:username").get(getProfilePosts);
router.route("/timeline/:userID").get(getTimelinePosts);
router.route("/").post(createPost);
router.route("/:id").put(updatePost).delete(deletePost).get(getPost);
router.route("/:id/like").put(likePost);

module.exports = router;
