import db from '../database/database.js';

export class LibroModel {
    static async registrarLibro(datos) {
        const { nombre, autor, editorial, genero, edad_sugerida, precio, fecha_recepcion } = datos;
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const queryLibro = `INSERT INTO Libro (nombre, autor, editorial, genero, edad_sugerida, precio, fecha_recepcion) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const [resultLibro] = await connection.query(queryLibro, [nombre, autor, editorial, genero, edad_sugerida, precio, fecha_recepcion]);
            const libroId = resultLibro.insertId;

            const codigoBarra = `CB-${libroId}-${Date.now()}`;
            const queryCopia = `INSERT INTO Copia (libro_id, codigo_barra, estado) VALUES (?, ?, 'Disponible')`;
            await connection.query(queryCopia, [libroId, codigoBarra]);

            await connection.commit();
            return { libroId, codigoBarra };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async actualizarPrecio(id, nuevo_precio) {
        const [rows] = await db.query(`SELECT precio FROM Libro WHERE id = ?`, [id]);
        if (rows.length === 0) return null; 
        if (parseFloat(nuevo_precio) <= parseFloat(rows[0].precio)) {
            throw new Error("El nuevo precio debe ser mayor al actual");
        }
        await db.query(`UPDATE Libro SET precio = ? WHERE id = ?`, [nuevo_precio, id]);
        return nuevo_precio;
    }

    static async listarDisponibles() {
        const query = `
            SELECT l.id, l.nombre, l.autor, COUNT(c.id) AS copias_disponibles 
            FROM Libro l 
            JOIN Copia c ON l.id = c.libro_id 
            WHERE c.estado = 'Disponible' 
            GROUP BY l.id
        `;
        const [libros] = await db.execute(query);
        return libros;
    }

    static async listarRecientes() {
        const query = `
            SELECT DISTINCT l.id, l.nombre, l.autor 
            FROM Libro l 
            JOIN Transaccion t ON l.id = t.libro_id 
            WHERE YEARWEEK(t.fecha, 1) = YEARWEEK(CURDATE(), 1)
        `;
        const [libros] = await db.execute(query);
        return libros;
    }

    static async top10Ficcion2026() {
        const query = `
            SELECT l.id, l.nombre, COUNT(t.id) AS cantidad_ventas 
            FROM Libro l 
            JOIN Transaccion t ON l.id = t.libro_id 
            WHERE l.genero = 'Ficción' AND t.tipo = 'Venta' AND YEAR(t.fecha) = 2026 AND t.semestre = 1 
            GROUP BY l.id ORDER BY cantidad_ventas DESC LIMIT 10
        `;
        const [libros] = await db.execute(query);
        return libros;
    }

    static async top10MenosPrestadosComedia2025() {
        const query = `
            SELECT l.id, l.nombre, COUNT(t.id) AS cantidad_prestamos 
            FROM Libro l 
            LEFT JOIN Transaccion t ON l.id = t.libro_id AND t.tipo = 'Prestamo' AND YEAR(t.fecha) = 2025 AND t.semestre = 2 
            WHERE l.genero = 'Comedia' 
            GROUP BY l.id ORDER BY cantidad_prestamos ASC LIMIT 10
        `;
        const [libros] = await db.execute(query);
        return libros;
    }
}