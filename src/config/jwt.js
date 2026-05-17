module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret_key",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
};

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};
