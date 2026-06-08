import express from 'express';
import dotenv from 'dotenv';
import apiRouter from './router/api.router.js';

dotenv.config();

const app = express();

app.use(express.json());

// Rutas base centralizadas
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de la Librería Doulos corriendo en el puerto ${PORT}`);
});