const db = require("../conexion/dataBase");

exports.createSale = async (req, res) => {
  const { producto_id, cantidad, tasa_bs } = req.body;

  try {
    // 1. Verificar si hay stock suficiente
    const [prod] = await db.query(
      "SELECT nombre, precio_usd, cantidad FROM productos WHERE id = ?",
      [producto_id],
    );

    if (prod.length === 0 || prod[0].cantidad < cantidad) {
      return res
        .status(400)
        .json({ message: "Stock insuficiente o producto no encontrado" });
    }

    const total_usd = prod[0].precio_usd * cantidad;

    // 2. Transacción: Restar stock y Crear Venta
    await db.query(
      "UPDATE productos SET cantidad = cantidad - ? WHERE id = ?",
      [cantidad, producto_id],
    );

    await db.query(
      "INSERT INTO ventas (producto_id, cantidad, total_usd, tasa_bs) VALUES (?, ?, ?, ?)",
      [producto_id, cantidad, total_usd, tasa_bs],
    );

    res.json({ message: "Venta realizada con éxito", total_usd });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al procesar la venta", error: error.message });
  }
};
