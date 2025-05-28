import { iniciarServidor } from './src/app.js';

iniciarServidor()
  .catch(error => {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  });