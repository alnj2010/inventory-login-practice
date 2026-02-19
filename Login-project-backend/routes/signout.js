const router = require("express").Router();
const { jsonResponse } = require("../conexion/jsonResponse");

router.delete("/", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  res.status(200).json(jsonResponse(200, { message: "Session closed" }));
});

module.exports = router;
