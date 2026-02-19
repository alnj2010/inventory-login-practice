const bcrypt = require("bcrypt");
const db = require("../conexion/dataBase");
const { jsonResponse } = require("../conexion/jsonResponse");
const router = require("express").Router();

router.post("/", async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Fields are required",
      }),
    );
  }

  try {
    //encriptar password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    //insertar a la base de datos
    const query =
      "INSERT INTO users (name, username, password) VALUE (?, ?, ?)";

    await db.execute(query, [name, username, hashedPassword]);

    res
      .status(200)
      .json(jsonResponse(200, { message: "User created successfully" }));
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json(jsonResponse(409, { error: "User already exists" }));
    }
    res.status(500).json(jsonResponse(500, { error: "Internal error" }));
  }

  res.send("signup");
});

module.exports = router;
