const registerModel = require("../models/UserRegister");
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

async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Get user with password (important)
    const user = await registerModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    // Compare password (Directly using bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Update last login (optional)
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const accessToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
}

((module.exports = register), l);
