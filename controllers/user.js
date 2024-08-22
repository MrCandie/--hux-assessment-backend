const Contact = require("../models/contact");
const User = require("../models/user");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");

exports.viewProfile = catchAsync(async (req, res, next) => {
  const profile = await User.findById(req.user.id).select(
    "name email createdAt"
  );

  if (!profile) return next(new AppError("User not found", 404));

  return res.status(200).json({
    status: "Success",
    data: profile,
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const profile = await User.findByIdAndUpdate(
    req.user.id,
    { name },
    { new: true, runValidators: true }
  ).select("name email createdAt");
  if (!profile) return next(new AppError("User not found", 404));

  return res.status(200).json({
    status: "Success",
    data: profile,
  });
});

exports.deleteAccount = catchAsync(async (req, res, next) => {
  const profile = await User.findByIdAndDelete(req.user.id);
  await Contact.deleteMany({ userId: req.user.id });
  if (!profile) return next(new AppError("User not found", 404));

  return res.status(204).json({
    status: "Success",
    data: null,
  });
});
