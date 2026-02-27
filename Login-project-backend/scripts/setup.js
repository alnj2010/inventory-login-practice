const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    console.log("🛠️ Iniciando configuración de la base de datos...");

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
    );
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log(`✅ Base de datos '${process.env.DB_NAME}' lista.`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
        role ENUM('USER', 'ADMIN') DEFAULT 'USER'
      )
    `);
    console.log("✅ Tabla 'usuarios' creada.");

    await connection.query(`
       CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        precio DECIMAL(10, 2) NOT NULL,
        cantidad INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tabla 'productos' creada.");

    await connection.query(`
      INSERT INTO productos (nombre, precio, cantidad) 
      VALUES ('Producto Inicial', 100.00, 10),
        ('Laptop', 1300.50, 10),
        ('MouseBluetooh', 47.00, 50),
        ('Teclado', 79.99, 30),
        ('Monitor', 320.00, 15),
        ('Audifonos', 110.00, 25)
    `);

    console.log("🚀 ¡Configuración completada con éxito!");
  } catch (error) {
    console.error("❌ Error configurando la base de datos:", error);
  } finally {
    await connection.end();
  }
}

setupDatabase();
