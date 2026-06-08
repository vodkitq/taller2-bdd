import { TransaccionModel } from '../model/TransaccionModel.js';
import { validateTransaccionSafeParse } from '../validators/TransaccionValidator.js';

export const TransaccionController = {
    registrarTransaccion: async (req, res) => {
        try {
            // 1. Validar con Zod
            const validator = validateTransaccionSafeParse(req.body);
            if (!validator.success) {
                return res.status(400).json({
                    message: "Datos de entrada inválidos",
                    errores: validator.error.issues
                });
            }

            // 2. Si pasa la validación, va al modelo
            const resultado = await TransaccionModel.registrarTransaccion(req.body);
            res.status(200).json({ 
                mensaje: "Transacción exitosa", 
                bono_ganado: resultado.bono, 
                precio_total: resultado.precioFinal 
            });
        } catch (error) { 
            res.status(400).json({ error: error.message }); 
        }
    },
    consultaDetalle: async (req, res) => {
        try {
            const detalles = await TransaccionModel.consultaDetalle(req.query.usuario_id, req.query.fecha);
            res.status(200).json({ detalles });
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    },
    cantidadLibrosVendidosAnoActual: async (req, res) => {
        try {
            const total = await TransaccionModel.cantidadLibrosVendidosAnoActual();
            res.status(200).json({ total_vendidos: total });
        } catch (error) { 
            res.status(500).json({ error: error.message }); 
        }
    }
};