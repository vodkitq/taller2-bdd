import { z } from 'zod';

const UsuarioSchema = z.object({
    rut: z.string({ required_error: "El RUT es obligatorio" }),
    nombre: z.string({ required_error: "El nombre es obligatorio" }),
    edad: z.number({ 
        required_error: "La edad es obligatoria", 
        invalid_type_error: "La edad debe ser un número" 
    }).min(0, "La edad debe ser un número positivo"),
    direccion: z.string({ required_error: "La dirección es obligatoria" })
});

export const validateUsuarioSafeParse = (data) => {
    return UsuarioSchema.safeParse(data);
};