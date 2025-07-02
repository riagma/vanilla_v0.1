import { Router } from 'express';
import { mwBaseDatos } from '../middlewares/mwBaseDatos.js';
import { mwExcepcion } from '../middlewares/mwExcepcion.js';
import { rutasEleccion } from './rutasEleccion.js';
import { rutasRegistro } from './rutasRegistro.js';

const router = Router();

router.use(mwBaseDatos);

router.use('/eleccion', rutasEleccion);
router.use('/registro', rutasRegistro);

router.use((peticion, respuesta, siguiente) => {
  respuesta.status(404).json({
    error: 'API endpoint no encontrado',
    ruta: peticion.originalUrl
  });
});

router.use(mwExcepcion);

export const rutasApi = router;