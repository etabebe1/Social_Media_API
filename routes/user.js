const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUserById,
  followUser,
  unfollowUser,
  followingFriends,
} = require("../controller/user");

router.route("/").get(getUserById);
router.route("/:id").put(updateUser).delete(deleteUser);
router.route("/:id/follow").put(followUser);
router.route("/:id/unfollow").put(unfollowUser);
router.route("/friends/:id").get(followingFriends);
module.exports = router;
