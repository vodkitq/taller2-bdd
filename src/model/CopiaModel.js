import db from '../database/database.js';

export class CopiaModel {
    static async deshabilitarCopia(id) {
        const query = `UPDATE Copia SET estado = 'Deshabilitado' WHERE id = ?`;
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }

    static async incrementarStock(libroId) {
        const [[libro]] = await db.execute("SELECT id FROM Libro WHERE id = ?", [libroId]);
        if (!libro) return null;

        const codigoBarra = `CB-${libroId}-${Date.now()}`;
        const query = `INSERT INTO Copia (libro_id, codigo_barra, estado) VALUES (?, ?, 'Disponible')`;
        await db.execute(query, [libroId, codigoBarra]);
        return codigoBarra;
    }
}