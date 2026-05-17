const registerModel = require("../models/UserRegister");
const loginModel = require("../models/UserLogin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const isAlreadyRegister = await registerModel.findOne({ email });

    if (isAlreadyRegister) {
      return res.status(409).json({
        success: false,
        message: "User account already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const RegisterUser = await registerModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const acsessToken = jwt.sign(
      {
        id: RegisterUser._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = jwt.sign(
      {
        id: RegisterUser._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: RegisterUser._id,
        name: RegisterUser.name,
        email: RegisterUser.email,
      },
      acsessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
}

module.exports = register;
