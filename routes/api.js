const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// 1. Registrar un nuevo libro
router.post('/libros', apiController.registrarLibro);

// 2. Registrar un nuevo usuario
router.post('/usuarios', apiController.registrarUsuario);

// 3. Eliminar (deshabilitar) una copia de libro
router.put('/copias/:id/deshabilitar', apiController.deshabilitarCopia);

// 4. Actualizar el precio de un libro
router.put('/libros/:id/precio', apiController.actualizarPrecioLibro);

// 5 al 16. Otras rutas para las funcionalidades restantes

module.exports = router;