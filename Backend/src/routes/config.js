const express = require("express");
const router = express.Router();
const configController = require("../controllers/configController");

// Importamos tus middlewares
const authenticate = require("../Middleware/authenticate"); // Asegúrate de que la ruta sea correcta
const isAdmin = require("../Middleware/isAdmin");

// PÚBLICO: El frontend necesita esto para mostrar los precios en Bs.
router.get("/tasa", configController.getTasa);

// PROTEGIDO: Solo el Admin puede actualizar la tasa manualmente
// Primero autenticamos (JWT) y luego verificamos si es Admin
router.put("/tasa", authenticate, isAdmin, configController.updateTasa);

module.exports = router;
