import { Router } from 'express';
import { controladorAutenticacion } from '../controladores/controladorAutenticacion.js';
import { validarEsquema } from '../middlewares/mwValidacion.js';
import { esquemaContrasena } from '../tipos/esquemas.js';

const router = Router();

router.post('/votante', controladorAutenticacion.loginVotante);
router.post('/admin', controladorAutenticacion.loginAdmin);

export const rutasLogin = router;