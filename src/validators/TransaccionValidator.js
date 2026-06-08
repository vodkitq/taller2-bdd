import { z } from 'zod';

const TransaccionSchema = z.object({
    usuario_id: z.number({ required_error: "ID de usuario obligatorio", invalid_type_error: "Debe ser un número" }).int(),
    libro_id: z.number({ required_error: "ID de libro obligatorio", invalid_type_error: "Debe ser un número" }).int(),
    copia_id: z.number({ required_error: "ID de copia obligatorio", invalid_type_error: "Debe ser un número" }).int(),
    bibliotecaria_id: z.number({ required_error: "ID de bibliotecaria obligatorio", invalid_type_error: "Debe ser un número" }).int(),
    tipo: z.enum(["Venta", "Prestamo"], { 
        required_error: "El tipo de transacción es obligatorio",
        invalid_type_error: "El tipo debe ser estrictamente 'Venta' o 'Prestamo'"
    })
});

export const validateTransaccionSafeParse = (data) => {
    return TransaccionSchema.safeParse(data);
};