const User = require("../models/user");
const catchAsync = require("../utils/catch-async");

exports.viewProfile = catchAsync(async (req, res, next) => {
  const profile = await User.findById(req.user.id).select(
    "name email createdAt"
  );

  return res.status(200).json({
    status: "Success",
    data: profile,
  });
});
