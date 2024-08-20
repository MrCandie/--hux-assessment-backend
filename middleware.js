const AppError = require("./utils/app-error");
const jwt = require("jsonwebtoken");
const catchAsync = require("./utils/catch-async");
const User = require("./models/user");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(new AppError("Session expired", 401));
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("user no longer exist", 404));
  }

  req.user = user;
  next();
});
