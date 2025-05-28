import express from 'express';
import cors from 'cors';
import { PUERTO } from './utils/constantes.js';
import { configurarServidorEstatico } from './utils/configServidorEstatico.js';
import { dbMiddleware } from './middlewares/bd.js';
import { rutasLogin } from './routes/rutasLogin.js';
import { rutasAdmin } from './routes/rutasAdmin.js';
import { rutasVotante } from './routes/rutasVotante.js';

export async function iniciarServidor() {
  const aplicacion = express();

  // Middlewares globales
  aplicacion.use(cors());
  aplicacion.use(express.json());
  aplicacion.use(dbMiddleware);

  // Prefijo común para todas las rutas API
  const routerAPI = express.Router();
  aplicacion.use('/api', routerAPI);

  // Rutas API
  routerAPI.use('/login', rutasLogin);
  routerAPI.use('/admin', rutasAdmin);
  routerAPI.use('/votante', rutasVotante);

  // Middleware para capturar 404s en rutas API
  routerAPI.use((peticion, respuesta, siguiente) => {
    respuesta.status(404).json({
      error: 'API endpoint no encontrado',
      ruta: peticion.originalUrl
    });
  });

  // Middleware para errores en rutas API
  routerAPI.use((error, peticion, respuesta, siguiente) => {
    console.error('Error en API:', error);
    respuesta.status(500).json({
      error: 'Error interno del servidor',
      mensaje: error.message
    });
  });

  // Servidor estático para el frontend (después del manejo de API)
  configurarServidorEstatico(aplicacion);

  // Iniciar servidor
  return new Promise((resolve) => {
    aplicacion.listen(PUERTO, () => {
      console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
      resolve(aplicacion);
    });
  });
}
