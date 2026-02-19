const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  // Solo incluimos lo necesario en el payload
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30m" },
  );
}

module.exports = { generateAccessToken, generateRefreshToken };
