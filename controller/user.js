const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

// update user
const updateUser = async (req, res) => {
  let {
    body: { userID, password },
    params: { id },
  } = req;

  const user = await User.findOne({ _id: id });

  if (userID === id || user.isAdmin) {
    if (password) {
      try {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
      } catch (error) {
        res.json(error);
      }
    }

    try {
      await User.findOneAndUpdate({ _id: id }, { $set: req.body });

      // res.json(updateUser);
      res.status(StatusCodes.OK).json("Your account has been updated");
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  } else {
    console.log("You can only update your account");
  }
};

// delete user
const deleteUser = async (req, res) => {
  let {
    body: { userID },
    params: { id },
  } = req;

  const user = await User.findOne({ _id: id });

  if (userID === id || user.isAdmin) {
    try {
      await User.deleteOne({ _id: id });
      res.status(StatusCodes.OK).json("Account has been deleted");
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  } else {
    res.status(StatusCodes.FORBIDDEN).json("You can only delete your account");
  }
};

// get a user query-search
const getUserById = async (req, res) => {
  const {
    query: { userID, username },
  } = req;

  try {
    const user = userID
      ? await User.findOne({ _id: userID })
      : await User.findOne({ username: username });

    const { password, updatedAt, ...other } = user._doc;

    res.status(StatusCodes.OK).json(other);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

// get a user by parameter
const getUserByParams = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { password, updatedAt, ...other } = user._doc;
  res.send(other);
};

// follow user
const followUser = async (req, res) => {
  const {
    body: { userID },
    params: { id },
  } = req;

  if (userID !== id) {
    try {
      const user = await User.findOne({ _id: id });
      const currentUser = await User.findOne({ _id: userID });

      const follows = user.followers.includes(userID);
      if (!follows) {
        await user.updateOne({ $push: { followers: userID } });
        await currentUser.updateOne({ $push: { following: id } });
        res.status(StatusCodes.OK).json("User has been followed");
      } else {
        res.status(StatusCodes.FORBIDDEN).json("You already follow this user");
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  } else {
    res.status(StatusCodes.FORBIDDEN).json("You can't follow yourself");
  }
};

// unfollow user
const unfollowUser = async (req, res) => {
  const {
    body: { userID },
    params: { id },
  } = req;

  if (userID !== id) {
    try {
      const user = await User.findOne({ _id: id });
      const currentUser = await User.findOne({ _id: userID });

      const follows = user.followers.includes(userID);

      if (follows) {
        await user.updateOne({ $pull: { followers: userID } });
        await currentUser.updateOne({ $pull: { following: id } });
        res.status(StatusCodes.OK).json("User has been unfollowed");
      } else {
        res
          .status(StatusCodes.FORBIDDEN)
          .json("You already unfollowed this user");
      }
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  } else {
    res.status(StatusCodes.FORBIDDEN).json("You can't unfollow yourself");
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUserById,
  followUser,
  unfollowUser,
  getUserByParams,
};
