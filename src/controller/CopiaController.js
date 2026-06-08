import { CopiaModel } from '../model/CopiaModel.js';

export const CopiaController = {
    deshabilitarCopia: async (req, res) => {
        try {
            const exito = await CopiaModel.deshabilitarCopia(req.params.id);
            if (!exito) return res.status(404).json({ mensaje: "Copia no encontrada" });
            res.status(200).json({ mensaje: "Copia deshabilitada" });
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    incrementarStock: async (req, res) => {
        try {
            const codigo_barra = await CopiaModel.incrementarStock(req.params.id);
            if (!codigo_barra) return res.status(404).json({ mensaje: "Libro no encontrado" });
            res.status(201).json({ mensaje: "Stock incrementado", codigo_barra });
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    }
};