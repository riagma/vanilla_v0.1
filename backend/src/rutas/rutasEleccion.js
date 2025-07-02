import { Router } from 'express';
import { controladorEleccion } from '../controladores/controladorEleccion.js';
import { validarEsquema } from '../middlewares/mwValidacion.js';
import { esquemaRegistroVotanteEleccionPeticion } from '../tipos/esquemas.js';

const router = Router();

router.get('/disponibles', controladorEleccion.obtenerEleccionesDisponibles);
router.get('/:idEleccion', controladorEleccion.obtenerEleccionPorId);
router.get('/:idEleccion/partidos', controladorEleccion.obtenerPartidosEleccion);
router.get('/:idEleccion/resultados', controladorEleccion.obtenerResultadosEleccion);

// router.post(
//   '/elecciones/:idEleccion/registro',
//   validarEsquema(esquemaRegistroVotanteEleccionPeticion),
//   controladorEleccion.registrarseEnEleccion
// );

// router.delete('/elecciones/:idEleccion/registro', controladorEleccion.anularRegistroEnEleccion);

export const rutasEleccion = router;