const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userLoginSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userLoginSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const loginModel = mongoose.model("Login", userLoginSchema);
module.exports = loginModel;
