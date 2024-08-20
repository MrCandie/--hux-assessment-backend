const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
      trim: true,
      required: [true, "Kindly provide contact first name"],
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
      required: [true, "Kindly provide contact last name"],
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    birthday: {
      type: String,
      default: "",
      trim: true,
    },
    relationship: {
      type: String,
      default: "",
      trim: true,
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Contact must belong to a user"],
      },
    ],
    userId: {
      type: String,
      required: [true, "Contact must belong to a user"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Contact = mongoose.model("Contact", schema);

module.exports = Contact;
