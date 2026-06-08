import db from '../database/database.js';

export class UsuarioModel {
    static async registrarUsuario(datos) {
        const { rut, nombre, edad, direccion } = datos;
        const query = `INSERT INTO Usuario (rut, nombre, edad, direccion) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(query, [rut, nombre, edad, direccion]);
        return result.insertId;
    }

    static async desactivarUsuario(id) {
        const query = `UPDATE Usuario SET estado = 'Desactivado' WHERE id = ?`;
        const [result] = await db.query(query, [id]);
        return result.affectedRows > 0;
    }

    static async listarUsuariosBibliotecarias() {
        const [usuarios] = await db.execute("SELECT id, nombre, rut, direccion FROM Usuario");
        const [bibliotecarias] = await db.execute("SELECT id, nombre, rut, estado FROM Bibliotecaria");
        return { usuarios, bibliotecarias };
    }

    static async listarUsuariosConTransacciones() {
        const query = `
            SELECT u.id, u.nombre, COUNT(t.id) AS total_transacciones
            FROM Usuario u
            JOIN Transaccion t ON u.id = t.usuario_id
            GROUP BY u.id, u.nombre
            HAVING total_transacciones > 0
        `;
        const [usuarios] = await db.execute(query);
        return usuarios;
    }

    static async listarClientes() {
        const query = `SELECT id, nombre, rut, edad, direccion FROM Usuario`;
        const [clientes] = await db.execute(query);
        return clientes;
    }
}