const Post = require("../model/postModel");
const User = require("../model/userModel");
const { StatusCodes } = require("http-status-codes");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");

// create a post
const createPost = async (req, res) => {
  const newPost = await Post.create({ ...req.body });

  try {
    res.status(StatusCodes.CREATED).json(newPost);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json(error);
  }
};

// update a post
const updatePost = async (req, res) => {
  const {
    body: { userID },
    params: { id },
  } = req;

  const postToUpdate = await Post.findOne({ _id: id });

  if (!postToUpdate) {
    throw new NotFoundError("Post not found");
  }
  if (userID !== postToUpdate.userID) {
    throw new UnauthenticatedError("You cannot update this post");
  } else {
    await postToUpdate.updateOne({ $set: req.body });
    res.status(StatusCodes.OK).json("The post has been updated");
  }
};

// delete a post
const deletePost = async (req, res) => {
  const {
    body: { userID },
    params: { id },
  } = req;

  const postToDelete = await Post.findOne({ _id: id });

  if (!postToDelete) {
    throw new NotFoundError("Post not found");
  }

  if (userID !== postToDelete.userID) {
    throw new UnauthenticatedError("You cannot delete this post");
  }

  if (userID === postToDelete.userID) {
    await postToDelete.deleteOne({ _id: id });
    res.status(StatusCodes.OK).json("Post successfully deleted");
  }
};

// like a post
const likePost = async (req, res) => {
  const {
    body: { userID },
    params: { id },
  } = req;

  const postToLike = await Post.findOne({ _id: id });

  if (!postToLike) {
    throw new NotFoundError("Post not found");
  }

  const liked = postToLike.likes.includes(userID);

  if (!liked) {
    await postToLike.updateOne({ $push: { likes: userID } });
    res.status(StatusCodes.OK).json("The post has been liked");
  } else {
    await postToLike.updateOne({ $pull: { likes: userID } });
    res.status(StatusCodes.OK).json("The post has been disliked");
  }
};

// get a post
const getPost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findOne({ _id: id });

  if (!post) {
    throw new NotFoundError("Post not found");
  }

  res.status(StatusCodes.OK).json(post);
};

// get all posts/timeline
const getTimelinePosts = async (req, res) => {
  const { userID } = req.params;

  try {
    let availablePost = [];

    const currentUser = await User.findOne({ _id: userID });
    const currentUserPosts = await Post.findOne({ userID: userID });

    availablePost.push(currentUserPosts);

    await Promise.all(
      currentUser.followers.map(async (friendID) => {
        const eachPost = await Post.findOne({ userID: friendID });
        availablePost.push(eachPost);
      })
    );

    res.status(StatusCodes.OK).json(availablePost);
  } catch (error) {
    console.log(error);
  }
};

// get all posts/profile
const getProfilePosts = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username: username });
    const posts = await Post.find({ userID: user._id });

    res.status(StatusCodes.OK).send(posts);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  getTimelinePosts,
  getProfilePosts,
  createPost,
  deletePost,
  updatePost,
  likePost,
  getPost,
};
