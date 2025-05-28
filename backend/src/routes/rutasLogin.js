import { Router } from 'express';
import { controladorAutenticacion } from '../controllers/controladorAutenticacion.js';

const router = Router();

router.post('/votante', controladorAutenticacion.loginVotante);
router.post('/admin', controladorAutenticacion.loginAdmin);

export const rutasLogin = router;