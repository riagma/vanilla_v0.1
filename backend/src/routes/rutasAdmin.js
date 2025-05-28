import { Router } from 'express';
import { verificarTokenAdmin } from '../middlewares/autenticacion.js';
import { adminController } from '../controllers/adminController.js';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(verificarTokenAdmin);

// Rutas del administrador
router.get('/', adminController.obtenerDatos);
router.get('/elecciones', adminController.listarElecciones);
router.post('/elecciones', adminController.crearEleccion);
router.put('/elecciones/:id', adminController.actualizarEleccion);
router.delete('/elecciones/:id', adminController.eliminarEleccion);

export const rutasAdmin = router;