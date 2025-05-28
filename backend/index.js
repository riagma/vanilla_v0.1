import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'secreto123';

// 🔥 Servir frontend Vite compilado
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rutaFrontend = path.join(__dirname, '../frontend/dist');
app.use(express.static(rutaFrontend));

// 👉 API login
app.post('/api/login', (req, res) => {
  const { usuario, clave } = req.body;
  if (usuario === 'admin' && clave === '1234') {
    const token = jwt.sign({ usuario }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

// 👉 API protegida
app.get('/api/privado', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No autorizado' });

  const token = auth.split(' ')[1];
  try {
    const datos = jwt.verify(token, SECRET);
    res.json({ mensaje: `Hola ${datos.usuario}, accediste a contenido protegido.` });
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
});

// 🚨 Redirigir todas las rutas no API al frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(rutaFrontend, 'index.html'));
});

app.listen(3000, () => console.log('Todo servido en http://localhost:3000'));
