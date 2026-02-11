const { jsonResponse } = require("../conexion/jsonResponse");

const router = require("express").Router();

router.post("/", (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Fields are required",
      }),
    );
  }

  res
    .status(200)
    .json(jsonResponse(200, { message: "User created successfully" }));

  res.send("signup");
});

module.exports = router;
