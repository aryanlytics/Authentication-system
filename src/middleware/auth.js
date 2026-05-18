const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

// 1. Auth middleware — protects routes
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

// 2. Refresh endpoint — frontend calls this when access token expires
async function refreshToken(req, res) {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET);

    // Issue new access token
    const newAccessToken = jwt.sign({ id: decoded.id }, config.JWT_SECRET, {
      expiresIn: "15m",
    });

    // ROTATION — issue new refresh token too (keeps user logged in)
    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      config.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.clearCookie("refreshToken");
    return res
      .status(401)
      .json({ message: "Refresh token expired, login again" });
  }
}
