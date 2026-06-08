import { LibroModel } from '../model/LibroModel.js';
import { validateLibroSafeParse } from '../validators/LibroValidator.js';

export const LibroController = {
    registrarLibro: async (req, res) => {
        try {
            // 1. Validar con Zod
            const validator = validateLibroSafeParse(req.body);
            if (!validator.success) {
                return res.status(400).json({
                    message: "Datos de entrada inválidos",
                    errores: validator.error.issues
                });
            }

            // 2. Si pasa la validación, va al modelo
            const resultado = await LibroModel.registrarLibro(req.body);
            res.status(201).json({ mensaje: "Libro registrado exitosamente", ...resultado });
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    actualizarPrecioLibro: async (req, res) => {
        try {
            const resultado = await LibroModel.actualizarPrecio(req.params.id, req.body.nuevo_precio);
            if (!resultado) return res.status(404).json({ mensaje: "Libro no encontrado" });
            res.status(200).json({ mensaje: "Precio actualizado", nuevo_precio: resultado });
        } catch (error) { 
            res.status(400).json({ error: error.message }); 
        }
    },
    listarLibrosDisponibles: async (req, res) => {
        try { 
            res.status(200).json({ libros: await LibroModel.listarDisponibles() }); 
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    listarLibrosRecientes: async (req, res) => {
        try { 
            res.status(200).json({ libros: await LibroModel.listarRecientes() }); 
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    top10Ficcion2026: async (req, res) => {
        try { 
            res.status(200).json({ libros: await LibroModel.top10Ficcion2026() }); 
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    top10MenosPrestadosComedia2025: async (req, res) => {
        try { 
            res.status(200).json({ libros: await LibroModel.top10MenosPrestadosComedia2025() }); 
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    }
};