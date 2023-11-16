const User = require("../model/userModel");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// register user
const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  res.status(StatusCodes.CREATED).json({
    user,
  });
};

// login user
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const passwordMatchTrue = await user.comparePassword(password);
  if (!passwordMatchTrue) {
    res.status(StatusCodes.BAD_REQUEST).json("You have entered wrong password");
    throw new UnauthenticatedError("Wrong Password");
  }

  res.status(StatusCodes.OK).json(user);
};

module.exports = { register, login };
