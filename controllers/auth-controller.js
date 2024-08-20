const createSendToken = require("../utils/jwt");

const User = require("../models/user");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const validator = require("validator");

const checkPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[!@#$%^&*()\-=_+[\]{};:"|,.<>/?]/.test(password) &&
    /\d/.test(password)
  );
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return next(
      new AppError("Kindly provide a valid name, email and password", 400)
    );
  }

  if (!validator.isEmail(email))
    return next(new AppError("Invalid email", 400));

  if (!checkPassword(password)) {
    return next(new AppError("Provide a secure password", 400));
  }

  const userExists = await User.find({ email });
  if (userExists.length !== 0) {
    return next(
      new AppError("User with this email address exists already", 400)
    );
  }
  const user = await User.create({
    name,
    email,
    password,
  });

  user.password = undefined;

  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError("Provide a valid email address and password", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!(await user.verifyPassword(password, user.password))) {
    return next(new AppError("Login details incorrect", 401));
  }

  createSendToken(user, 200, res);
});
