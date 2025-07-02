import { Router } from 'express';
import { verificarTokenAdmin } from '../middlewares/mwAutenticacion.js';
import { controladorAdmin } from '../controladores/controladorAdmin.js';
import { validarEsquema } from '../middlewares/mwValidacion.js';
import { esquemaEleccion } from '../tipos/esquemas.js';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(verificarTokenAdmin);

// Rutas del administrador
router.get('/', controladorAdmin.obtenerDatos);
router.get('/elecciones', controladorAdmin.listarElecciones);
router.post('/elecciones', 
  validarEsquema(esquemaEleccion),
  controladorAdmin.crearEleccion
);
router.put('/elecciones/:id', controladorAdmin.actualizarEleccion);
router.delete('/elecciones/:id', controladorAdmin.eliminarEleccion);

export const rutasAdmin = router;