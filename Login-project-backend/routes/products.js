const router = require("express").Router();
const authenticate = require("../Middleware/authenticate");
const db = require("../conexion/dataBase");

router.get("/", authenticate, async (req, res) => {
  // MUI Base envía la página empezando en 0
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const offset = page * limit;

  try {
    // Consulta para obtener solo el "pedazo" de datos de la página actual
    // En MySQL: LIMIT cantidad_registros OFFSET desde_donde
    const [rows] = await db.query(
      "SELECT * FROM productos ORDER BY id ASC LIMIT ? OFFSET ?",
      [limit, offset],
    );

    // Consulta para saber el total (necesario para que MUI sepa cuántas páginas hay)
    const [totalRows] = await db.query(
      "SELECT COUNT(*) as total FROM productos",
    );
    const total = totalRows[0].total;

    res.json({
      body: {
        items: rows,
        total: total,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
