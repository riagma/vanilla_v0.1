import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaFrontend = path.join(__dirname, '../../../frontend/dist');

export function configurarServidorEstatico(aplicacion) {
  // Servir archivos estáticos
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
}