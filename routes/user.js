const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUserById,
  followUser,
  unfollowUser,
  // getUserByParams,
} = require("../controller/user");

router.route("/").get(getUserById);
// router.route("/:id").get(getUserByParams).put(updateUser).delete(deleteUser);
router.route("/:id").put(updateUser).delete(deleteUser);
router.route("/:id/follow").put(followUser);
router.route("/:id/unfollow").put(unfollowUser);

module.exports = router;
