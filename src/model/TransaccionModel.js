import db from '../database/database.js';
import { calcularBonoVenta, calcularBonoPrestamo } from '../utils/calculadoraBonos.js';

export class TransaccionModel {
    static async registrarTransaccion(datos) {
        const { usuario_id, libro_id, copia_id, bibliotecaria_id, tipo } = datos;
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();

            const [[libro]] = await connection.execute("SELECT precio, edad_sugerida FROM Libro WHERE id = ?", [libro_id]);
            const [[usuario]] = await connection.execute("SELECT edad FROM Usuario WHERE id = ?", [usuario_id]);
            const [[copia]] = await connection.execute("SELECT estado FROM Copia WHERE id = ? AND libro_id = ?", [copia_id, libro_id]);

            if (!libro || !usuario) throw new Error("Libro o usuario no encontrado");
            if (usuario.edad < libro.edad_sugerida) throw new Error("Usuario no cumple con la edad sugerida");
            if (!copia || copia.estado !== 'Disponible') throw new Error("La copia seleccionada no está disponible");

            const fechaActual = new Date();
            let precioFinal = parseFloat(libro.precio);
            let bono = 0;

            if (tipo === "Venta") {
                precioFinal = precioFinal * 1.19; 
                bono = calcularBonoVenta(libro.precio, fechaActual);
            } else if (tipo === "Prestamo") {
                bono = calcularBonoPrestamo(libro.precio, fechaActual);
            } else {
                throw new Error("Tipo de transacción inválido");
            }

            const semestre = fechaActual.getMonth() < 6 ? 1 : 2;
            const insertQuery = `INSERT INTO Transaccion (usuario_id, libro_id, bibliotecaria_id, tipo, fecha, semestre, precio_final) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            await connection.execute(insertQuery, [usuario_id, libro_id, bibliotecaria_id, tipo, fechaActual, semestre, precioFinal]);
            
            await connection.execute("UPDATE Bibliotecaria SET bono = bono + ? WHERE id = ?", [bono, bibliotecaria_id]);
            
            const nuevoEstado = tipo === "Venta" ? "Vendido" : "Prestado";
            await connection.execute("UPDATE Copia SET estado = ? WHERE id = ?", [nuevoEstado, copia_id]);
            
            await connection.commit();
            return { bono, precioFinal };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async consultaDetalle(usuario_id, fecha) {
        const query = `
            SELECT t.tipo, t.fecha, l.nombre AS libro, l.autor, t.precio_final
            FROM Transaccion t
            JOIN Libro l ON t.libro_id = l.id
            WHERE t.usuario_id = ? AND DATE(t.fecha) = ?
        `;
        const [detalles] = await db.execute(query, [usuario_id, fecha]);
        return detalles;
    }

    static async cantidadLibrosVendidosAnoActual() {
        const query = `SELECT COUNT(*) AS total_vendidos FROM Transaccion WHERE tipo = 'Venta' AND YEAR(fecha) = YEAR(CURDATE())`;
        const [[resultado]] = await db.execute(query);
        return resultado.total_vendidos;
    }
}