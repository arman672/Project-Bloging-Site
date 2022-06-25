const mongoose = require("mongoose");
let validator = require("validator");

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      enum: ["Mr", "Mrs", "Miss"],
      required: true,
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: [validator.isEmail, "please enter the valid emailId"],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);
