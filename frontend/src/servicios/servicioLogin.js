import { api } from './api.js';
import { contexto, TIPOS_USUARIO, notificarCambios } from '../contexto.js';

export const servicioLogin = {
    async loginAdmin(correo, contrasena) {
        try {
            const { token, administrador } = await api.post('/api/login/admin', {
                correo,
                contrasena
            });

            // Actualizar contexto
            contexto.token = token;
            contexto.tipoUsuario = TIPOS_USUARIO.ADMIN;
            contexto.datosAdmin = administrador;
            contexto.usuario = { nombre: administrador.correo };
            
            // Notificar cambios
            notificarCambios();

            return contexto;
        } catch (error) {
            throw new Error('Error en login de administrador: ' + error.message);
        }
    },

    async loginVotante(dni, contrasena) {
        try {
            const resultado = await api.post('/api/login/votante', {
                dni,
                contrasena
            });
            
            contexto.token = resultado.token;
            contexto.tipoUsuario = TIPOS_USUARIO.VOTANTE;
            contexto.usuario = resultado.votante;
            contexto.datosVotante = resultado.votante;

            // Notificar cambios
            notificarCambios();

            return resultado;
        } catch (error) {
            throw new Error('Error en login de votante: ' + error.message);
        }
    },
};