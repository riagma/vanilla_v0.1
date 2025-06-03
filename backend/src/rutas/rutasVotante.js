import { Router } from 'express';
import { verificarTokenVotante } from '../middlewares/mwAutenticacion.js';
import { controladorVotante } from '../controladores/controladorVotante.js';
import { validarEsquema } from '../middlewares/mwValidacion.js';
import { esquemaRegistroVotanteEleccion } from '../tipos/esquemas.js';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(verificarTokenVotante);

// Rutas del votante

router.get('/', controladorVotante.obtenerDatosVotante);

router.get('/elecciones', controladorVotante.listarEleccionesDisponibles);
router.get('/elecciones/:idEleccion', controladorVotante.obtenerDetalleEleccion);

router.post(
  '/elecciones/:id/registro',
  validarEsquema(esquemaRegistroVotanteEleccion),
  controladorVotante.registrarseEnEleccion
);

export const rutasVotante = router;