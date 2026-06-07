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

// 5. Desactivar un usuario
router.put('/usuarios/:id/desactivar', apiController.desactivarUsuario);

// 6. Registrar nuevo prestamo/venta
router.post('/transacciones', apiController.registrarTransaccion);

// 7. Consultar el detalle del préstamo/venta de un usuario específico para una fecha determinada.
router.get('/transacciones/detalle', apiController.consultaDetalle);

// 8. Listar usuarios y biblitecarias
router.get('/usuariosBibliotecarias', apiController.listarUsuariosBibliotecarias);

module.exports = router;