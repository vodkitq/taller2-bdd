const express = require('express');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas base
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de la Librería Doulos corriendo en el puerto ${PORT}`);
});