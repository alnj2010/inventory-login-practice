const express = require("express");
const router = express.Router();
const db = require("../db"); // Tu pool de conexiones
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, async (req, res) => {
  const { producto_id, cantidad, precio_unitario } = req.body;

  // Obtenemos una conexión del pool para la transacción
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Obtener la tasa actual de la tabla 'configuracion'
    const [config] = await connection.query(
      "SELECT valor FROM configuracion WHERE clave = 'tasa_dolar'",
    );
    const tasaActual = config[0].valor;

    // 2. Verificar stock del producto
    const [product] = await connection.query(
      "SELECT cantidad, precio_usd FROM productos WHERE id = ?",
      [producto_id],
    );

    if (!product[0] || product[0].cantidad < cantidad) {
      throw new Error("Stock insuficiente o producto no encontrado");
    }

    const totalUsd = product[0].precio_usd * cantidad;

    // 3. Registrar la venta en tu tabla 'ventas'
    await connection.query(
      `INSERT INTO ventas (producto_id, cantidad, total_usd, tasa_bs) 
             VALUES (?, ?, ?, ?)`,
      [producto_id, cantidad, totalUsd, tasaActual],
    );

    // 4. Descontar el stock en 'productos'
    await connection.query(
      "UPDATE productos SET cantidad = cantidad - ? WHERE id = ?",
      [cantidad, producto_id],
    );

    await connection.commit();
    res.status(201).json({ message: "Venta procesada exitosamente" });
  } catch (error) {
    await connection.rollback();
    console.error("Error en transacción:", error.message);
    res.status(400).json({ message: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;
