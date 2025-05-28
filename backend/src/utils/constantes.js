import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const RUTA_BD = process.env.NODE_ENV === 'production'
  ? '/var/lib/vanilla-voting/vanilla.db'
  : path.join(__dirname, '../bd/datos/dev.db');