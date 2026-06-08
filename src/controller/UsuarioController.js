import { UsuarioModel } from '../model/UsuarioModel.js';
import { validateUsuarioSafeParse } from '../validators/UsuarioValidator.js'

export const UsuarioController = {
    registrarUsuario: async (req, res) => {
        try {
            // 1. Validar con Zod
            const validator = validateUsuarioSafeParse(req.body);
            if (!validator.success) {
                return res.status(400).json({
                    message: "Datos de entrada inválidos",
                    errores: validator.error.issues
                });
            }

            // 2. Si pasa la validación, va al modelo
            const usuario_id = await UsuarioModel.registrarUsuario(req.body);
            res.status(201).json({ mensaje: "Usuario registrado", usuario_id });
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    desactivarUsuario: async (req, res) => {
        try {
            const exito = await UsuarioModel.desactivarUsuario(req.params.id);
            if (!exito) return res.status(404).json({ mensaje: "Usuario no encontrado" });
            res.status(200).json({ mensaje: "Usuario desactivado" });
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    listarUsuariosBibliotecarias: async (req, res) => {
        try { 
            res.status(200).json(await UsuarioModel.listarUsuariosBibliotecarias()); 
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    listarUsuariosConTransacciones: async (req, res) => {
        try { 
            res.status(200).json({ usuarios: await UsuarioModel.listarUsuariosConTransacciones() }); 
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    listarClientes: async (req, res) => {
        try { 
            res.status(200).json({ clientes: await UsuarioModel.listarClientes() }); 
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    }
};