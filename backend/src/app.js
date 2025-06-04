import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PUERTO } from './utiles/constantes.js';
import { mwBaseDatos } from './middlewares/mwBaseDatos.js';
import { mwExcepcion } from './middlewares/mwExcepcion.js';
import { rutasLogin } from './rutas/rutasLogin.js';
import { rutasAdmin } from './rutas/rutasAdmin.js';
import { rutasVotante } from './rutas/rutasVotante.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaFrontend = path.join(__dirname, '../../frontend/dist');

export async function iniciarServidor() {
  const aplicacion = express();

  // Middlewares globales
  aplicacion.use(cors());
  aplicacion.use(express.json());
  
  // Prefijo común para todas las rutas API
  const routerAPI = express.Router();
  
  // Aplicar middleware de BD solo a las rutas API
  routerAPI.use(mwBaseDatos);
  
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
  routerAPI.use(mwExcepcion);
  
  // Servidor estático para el frontend
  aplicacion.use(express.static(rutaFrontend));

  // Ruta catch-all para SPA
  aplicacion.get('*', (peticion, respuesta) => {
    // Ignorar peticiones a la API (ya manejadas anteriormente)
    if (peticion.originalUrl.startsWith('/api/')) {
      return siguiente();
    }

    // Servir index.html para todas las demás rutas
    respuesta.sendFile(path.join(rutaFrontend, 'index.html'));
  });

  // Iniciar servidor
  return new Promise((resolve) => {
    aplicacion.listen(PUERTO, () => {
      console.log(`Servidor iniciado en http://localhost:${PUERTO}`);
      resolve(aplicacion);
    });
  });
}
