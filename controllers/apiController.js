const db = require('../config/db');

const apiController = {
    // 1. Registrar un nuevo libro
    registrarLibro: async (req, res) => {
        try {
            const { nombre, autor, editorial, genero, edad_sugerida, precio, fecha_recepcion } = req.body;
            const query = `INSERT INTO Libro (nombre, autor, editorial, genero, edad_sugerida, precio, fecha_recepcion) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const [result] = await db.query(query, [nombre, autor, editorial, genero, edad_sugerida, precio, fecha_recepcion]);
            res.status(201).json({ mensaje: "Libro registrado", libro_id: result.insertId });
        } catch (error) { res.status(500).json({ error: error.message }); }
    },

    // 2. Registrar un nuevo usuario
    registrarUsuario: async (req, res) => {
        try {
            const { rut, nombre, edad, direccion } = req.body;
            const query = `INSERT INTO Usuario (rut, nombre, edad, direccion) VALUES (?, ?, ?, ?)`;
            const [result] = await db.query(query, [rut, nombre, edad, direccion]);
            res.status(201).json({ mensaje: "Usuario registrado", usuario_id: result.insertId });
        } catch (error) { res.status(500).json({ error: error.message }); }
    },

    // 3. Deshabilitar copia
    deshabilitarCopia: async (req, res) => {
        try {
            const query = `UPDATE Copia SET estado = 'Deshabilitado' WHERE id = ?`;
            const [result] = await db.query(query, [req.params.id]);
            if (result.affectedRows === 0) return res.status(404).json({ mensaje: "Copia no encontrada" });
            res.status(200).json({ mensaje: "Copia deshabilitada" });
        } catch (error) { res.status(500).json({ error: error.message }); }
    },

    // 4. Actualizar precio
    actualizarPrecioLibro: async (req, res) => {
        try {
            const { id } = req.params;
            const { nuevo_precio } = req.body;
            const [rows] = await db.query(`SELECT precio FROM Libro WHERE id = ?`, [id]);
            if (rows.length === 0) return res.status(404).json({ mensaje: "Libro no encontrado" });
            
            if (parseFloat(nuevo_precio) <= parseFloat(rows[0].precio)) {
                return res.status(400).json({ mensaje: "El nuevo precio debe ser mayor" });
            }
            await db.query(`UPDATE Libro SET precio = ? WHERE id = ?`, [nuevo_precio, id]);
            res.status(200).json({ mensaje: "Precio actualizado", nuevo_precio });
        } catch (error) { res.status(500).json({ error: error.message }); }
    }
    
    // Continuar del 5 al 16 con las demás funcionalidades...
};

module.exports = apiController;