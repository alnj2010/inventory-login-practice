const router = require("express").Router();
const authenticate = require("../Middleware/authenticate");
const db = require("../conexion/dataBase");
const isAdmin = require("../Middleware/isAdmin");
const { jsonResponse } = require("../conexion/jsonResponse");

router.get("/", authenticate, async (req, res) => {
  // MUI Base envía la página empezando en 0
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 5;
  const offset = page * limit;

  try {
    const [rows] = await db.query(
      "SELECT * FROM productos ORDER BY id ASC LIMIT ? OFFSET ?",
      [limit, offset],
    );
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
    res.status(500).json(jsonResponse({ error: "Error en el servidor" }));
  }
});

router.delete("/:id", authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM productos WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json(jsonResponse(404, { error: "Producto no encontrado" }));
    }
    res
      .status(200)
      .json(jsonResponse(200, { message: "Producto eliminado correctamente" }));
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json(jsonResponse(500, { error: "Error al eliminar el producto" }));
  }
});

module.exports = router;
