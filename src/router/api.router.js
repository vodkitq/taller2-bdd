import { Router } from 'express';
import { LibroController } from '../controller/LibroController.js';
import { UsuarioController } from '../controller/UsuarioController.js';
import { CopiaController } from '../controller/CopiaController.js';
import { TransaccionController } from '../controller/TransaccionController.js';

const router = Router();

// Libros
router.post('/libros', LibroController.registrarLibro);
router.put('/libros/:id/precio', LibroController.actualizarPrecioLibro);
router.get('/libros/disponibles', LibroController.listarLibrosDisponibles);
router.get('/libros/recientes', LibroController.listarLibrosRecientes);

// Usuarios
router.post('/usuarios', UsuarioController.registrarUsuario);
router.put('/usuarios/:id/desactivar', UsuarioController.desactivarUsuario);
router.get('/clientes', UsuarioController.listarClientes);
router.get('/usuariosBibliotecarias', UsuarioController.listarUsuariosBibliotecarias);
router.get('/usuariosConTransacciones', UsuarioController.listarUsuariosConTransacciones);

// Copias
router.put('/copias/:id/deshabilitar', CopiaController.deshabilitarCopia);
router.post('/libros/:id/copias', CopiaController.incrementarStock);

// Transacciones
router.post('/transacciones', TransaccionController.registrarTransaccion);
router.get('/transacciones/detalle', TransaccionController.consultaDetalle);
router.get('/transacciones/ventas/ano-actual', TransaccionController.cantidadLibrosVendidosAnoActual);

// Reportes
router.get('/reportes/top-ficcion-2026', LibroController.top10Ficcion2026);
router.get('/reportes/menos-prestados-comedia-2025', LibroController.top10MenosPrestadosComedia2025);

export default router;