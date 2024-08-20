const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Provide a valid email"],
      validate: [validator.isEmail, "enter a valid email address"],
    },
    password: {
      type: String,
      trim: true,
      minlength: [7, "password cannot be less than 7 digits"],
      required: [true, "enter a valid password"],
      select: false,
    },

    verifiedAt: Date,
    passwordChangedAt: Date,
    passwordResetToken: String,
    accountVerificationToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.verifyPassword = async function (enteredPassword, password) {
  return await bcrypt.compare(enteredPassword, password);
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

userSchema.methods.createAccountVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  return token;
};

userSchema.methods.passwordChanged = function (jwtTime) {
  if (this.passwordChangedAt) {
    const passwordTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTime < passwordTimeStamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
