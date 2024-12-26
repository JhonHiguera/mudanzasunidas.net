// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const pool = mysql.createPool({
    host: "82.180.153.149",
    user: "root",
    password: "Mudanzas2024",
    database: "mudanzas_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Database schema
const dbSchema = `
CREATE DATABASE IF NOT EXISTS mudanzas_unidas;
USE mudanzas_unidas;

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    content TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

// Initialize database
pool.query(dbSchema, (err) => {
    if (err) throw err;
    console.log('Database initialized');
});

// API Routes

// 1. Contact Form Submission
app.post('/api/contact', async (req, res) => {
    const { nombre, apellido, correo, telefono } = req.body;
    
    const query = 'INSERT INTO contacts (nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?)';
    
    try {
        const [results] = await pool.promise().execute(query, [nombre, apellido, correo, telefono]);
        res.status(201).json({
            success: true,
            message: 'Contacto guardado exitosamente',
            id: results.insertId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al guardar el contacto',
            error: error.message
        });
    }
});

// 2. Navigation Endpoints
app.get('/api/sections/:id', async (req, res) => {
    const sectionId = req.params.id;
    const query = 'SELECT * FROM sections WHERE name = ?';
    
    try {
        const [results] = await pool.promise().execute(query, [sectionId]);
        if (results.length > 0) {
            res.json({
                success: true,
                section: results[0]
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Sección no encontrada'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la sección',
            error: error.message
        });
    }
});

// 3. Search Functionality
app.get('/api/search', async (req, res) => {
    const searchTerm = req.query.q;
    const query = `
        SELECT * FROM sections 
        WHERE content LIKE ?
        OR name LIKE ?
    `;
    
    try {
        const [results] = await pool.promise().execute(query, 
            [`%${searchTerm}%`, `%${searchTerm}%`]
        );
        res.json({
            success: true,
            results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en la búsqueda',
            error: error.message
        });
    }
});

// 4. Get All Contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const [results] = await pool.promise().query('SELECT * FROM contacts ORDER BY fecha_creacion DESC');
        res.json({
            success: true,
            contacts: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener contactos',
            error: error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});