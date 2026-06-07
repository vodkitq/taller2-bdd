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
    },
    
    // 5. Desactivar un usuario
    desactivarUsuario: async (req, res) => {
        try {
            const {id}= req.params;
            const query = `UPDATE Usuario SET estado = 'Desactivado' WHERE id = ?`;
            const [result] = await db.query(query, [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: "Usuario no encontrado" });
            }
            res.status(200).json({ mensaje: "Usuario desactivado" });
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },

    // 6. Registrar nuevo prestamo/venta
    registrarTransaccion: async (req, res) => {
        try{
            const { usuario_id, libro_id, bibliotecaria_id, tipo } = req.body;
            const connection = await db.beginTransaction();
            const [[libro]] = await connection.execute("SELECT precio, edad_sugerida, stock FROM libros WHERE id_libro = ?", [libro_id]);
            const [[usuario]] = await connection.execute("SELECT edad FROM usuarios WHERE id_usuario = ?", [usuario_id]);
            if (usuario.edad < libro.edad_sugerida) {
                return res.status(400).json({ mensaje: "Usuario no cumple con la edad sugerida" });
            }
            const fechaActual = new Date();
            let precioFinal = libro.precio;
            let bono = 0;
            if (tipo === "Venta") {
                bono = calcularBonoVenta(libro.precio, fechaActual);
            } else if (tipo === "Prestamo") {
                bono = calcularBonoPrestamo(libro.precio, fechaActual);
            }else {
                return res.status(400).json({ mensaje: "Tipo de transacción inválido" });
            }
            const semestre = fechaActual.getMonth() < 6 ? 1 : 2;
            const insertQuery = `INSERT INTO transacciones (usuario_id, libro_id, bibliotecaria_id, tipo, fecha, semestre, precio_final) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            await connection.execute(insertQuery, [usuario_id, libro_id, bibliotecaria_id, tipo, fechaActual, semestre, precioFinal]);
            await connection.execute("UPDATE bibliotecarias SET bono = bono + ? WHERE bibliotecaria_id = ?", [bono, bibliotecaria_id]);
            await connection.execute("UPDATE libros SET stock = stock - 1 WHERE id_libro = ?", [libro_id]);
            await connection.commit();
            res.status(200).json({ mensaje: "Transacción exitosa", bono_ganado: bono });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        } finally {
            connection.release();
        }
    },

    // 7. Consultar el detalle del préstamo/venta de un usuario específico para una fecha determinada.
    consultaDetalle: async (req, res) => {
        try{
            const { usuario_id, fecha } = req.query;
            const query = `SELECT t.tipo, t.fecha, l.nombre AS libro, l.autor, t.precio_final
                            FROM transacciones t
                            JOIN libros l ON t.libro_id = l.id_libro
                            WHERE t.usuario_id = ? AND DATE(t.fecha) = ?`;
            const[detalles] = await db.execute(query, [usuario_id, fecha]);
            res.status(200).json({ detalles });
        } catch (error) {
            res.status(500).json({ error: "Error al consultar el detalle de la transacción" });
        }
    },


};

module.exports = apiController;