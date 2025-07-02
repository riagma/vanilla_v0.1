import { Router } from 'express';
import { mwBaseDatos } from '../middlewares/mwBaseDatos.js';
import { mwExcepcion } from '../middlewares/mwExcepcion.js';
import { rutasLogin } from './rutasLogin.js';
import { rutasAdmin } from './rutasAdmin.js';
import { rutasVotante } from './rutasVotante.js';
import { rutasRegistro } from './rutasRegistro.js';

const router = Router();

router.use(mwBaseDatos);

router.use('/login', rutasLogin);
router.use('/admin', rutasAdmin);
router.use('/votante', rutasVotante);
router.use('/registro', rutasRegistro);

router.use((peticion, respuesta, siguiente) => {
  respuesta.status(404).json({
    error: 'API endpoint no encontrado',
    ruta: peticion.originalUrl
  });
});

router.use(mwExcepcion);


export const rutasApi = router;