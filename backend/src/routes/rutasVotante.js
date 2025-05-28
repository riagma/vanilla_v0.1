import { Router } from 'express';
import { verificarTokenVotante } from '../middlewares/autenticacion.js';
import { votanteController } from '../controllers/votanteController.js';

const router = Router();

// Middleware de autenticación para todas las rutas
router.use(verificarTokenVotante);

// Rutas del votante
router.get('/', votanteController.obtenerDatos);
router.get('/elecciones', votanteController.listarEleccionesDisponibles);
router.post('/elecciones/:id/registro', votanteController.registrarseEnEleccion);
router.post('/elecciones/:id/voto', votanteController.emitirVoto);

export const rutasVotante = router;