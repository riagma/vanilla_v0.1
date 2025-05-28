import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import { createInterface } from 'readline';
import { RUTA_BD } from '../../utils/constantes.js';

// Obtener __dirname en ESM
const __nombreArchivo = fileURLToPath(import.meta.url);
const __directorioBase = dirname(__nombreArchivo);

// Ruta al archivo SQL
const archivoSQL = resolve(__directorioBase, 'ddl.sql');

// Función para preguntar al usuario
function preguntarUsuario(pregunta) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolver => {
        rl.question(pregunta, (respuesta) => {
            rl.close();
            resolver(respuesta.toLowerCase().startsWith('s'));
        });
    });
}

async function inicializarBaseDatos() {
    try {
        // Verificar si la BD existe
        const existeBD = await fs.access(RUTA_BD)
            .then(() => true)
            .catch(() => false);

        if (existeBD) {
            const sobrescribir = await preguntarUsuario(
                `⚠️  La base de datos ya existe en: ${RUTA_BD}\n` +
                '¿Desea sobrescribirla? (s/N): '
            );

            if (!sobrescribir) {
                console.log('❌ Operación cancelada.');
                process.exit(0);
            }

            // Eliminar el archivo existente
            console.log('🗑️  Eliminando base de datos existente...');
            await fs.unlink(RUTA_BD);
        }

        // Asegurar que existe el directorio para la BD
        const directorioBD = dirname(RUTA_BD);
        await fs.mkdir(directorioBD, { recursive: true });

        // Cargar el DDL desde archivo SQL
        const sentenciasSQL = await fs.readFile(archivoSQL, 'utf-8');
        
        // Crear o abrir la base de datos
        const bd = new sqlite3.Database(RUTA_BD);
        
        // Convertir métodos de bd a promesas
        const ejecutar = (sql) => new Promise((resolver, rechazar) => {
            bd.exec(sql, (error) => {
                if (error) rechazar(error);
                else resolver();
            });
        });

        console.log(`\n🚀 Inicializando base de datos en: ${RUTA_BD}`);
        await ejecutar(sentenciasSQL);
        console.log('✅ Base de datos creada exitosamente.');
        
        // Cerrar la base de datos después de terminar
        bd.close((error) => {
            if (error) {
                console.error('❌ Error al cerrar la base de datos:', error.message);
            } else {
                console.log('👋 Conexión a base de datos cerrada.');
            }
        });

    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
        process.exit(1);
    }
}

inicializarBaseDatos();
