import { z } from 'zod';

const LibroSchema = z.object({
    nombre: z.string({ required_error: "El nombre del libro es obligatorio" }),
    autor: z.string({ required_error: "El autor es obligatorio" }),
    editorial: z.string({ required_error: "La editorial es obligatoria" }),
    genero: z.string({ required_error: "El género es obligatorio" }),
    edad_sugerida: z.number({ 
        required_error: "La edad sugerida es obligatoria", 
        invalid_type_error: "La edad sugerida debe ser un número" 
    }).min(0, "La edad sugerida no puede ser negativa"),
    precio: z.number({ 
        required_error: "El precio es obligatorio", 
        invalid_type_error: "El precio debe ser un número" 
    }).min(0, "El precio mínimo es 0"),
    fecha_recepcion: z.string({ required_error: "La fecha de recepción es obligatoria" })
});

export const validateLibroSafeParse = (data) => {
    return LibroSchema.safeParse(data);
};

export const validateLibroParcialSafeParse = (data) => {
    return LibroSchema.partial().safeParse(data);
};