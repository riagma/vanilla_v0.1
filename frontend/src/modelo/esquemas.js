import { z } from "zod";

export const esquemaVotante = z.object({
  dni: z.string().min(1),
  nombre: z.string().min(1),
  primerApellido: z.string().min(1),
  segundoApellido: z.string().min(1),
  correoElectronico: z.string().email().optional().nullable()
});

const fechaLocal = z.string().refine(
  val => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val),
  { message: "Formato de fecha inválido (debe ser YYYY-MM-DD HH:mm:ss)" }
);

export const esquemaEleccion = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(1),
  descripcion: z.string().min(1),
  fechaInicioRegistro: fechaLocal,
  fechaFinRegistro: fechaLocal,
  fechaInicioVotacion: fechaLocal,
  fechaFinVotacion: fechaLocal,
  fechaEscrutinio: fechaLocal,
  claveVotoPublica: z.string().optional().nullable(),
  claveVotoPrivada: z.string().optional().nullable(),
  claveVotoPrivadaEncriptada: z.string().optional().nullable()
});

// Array de elecciones
export const esquemaElecciones = z.array(esquemaEleccion);

// Esquema para respuesta de login
export const esquemaRespuestaLogin = z.object({
  token: z.string(),
  tipo: z.enum(['ADMIN', 'VOTANTE']),
  usuario: z.object({
    nombre: z.string(),
    dni: z.string().optional(),
    correo: z.string().email().optional()
  })
});

// Esquema para Partido
export const esquemaPartido = z.object({
  // id: z.number().int().positive(),
  nombre: z.string().min(1),
  siglas: z.string().min(1),
  logo: z.string().url().optional().nullable(),
  programa: z.string().min(1).optional().nullable()
});

// Esquema para resultado de Partido
export const esquemaResultadoPartido = z.object({
  idPartido: z.number().int().positive(),
  nombrePartido: z.string(),
  votos: z.number().int().nonnegative(),
  porcentaje: z.number().min(0).max(100)
});

// Esquema para Resultados
export const esquemaResultados = z.object({
  participacion: z.number().min(0).max(100),
  totalVotos: z.number().int().nonnegative(),
  censados: z.number().int().nonnegative(),
  porPartido: z.array(esquemaResultadoPartido)
});

// Esquema para registro de Votante
export const esquemaRegistroVotante = z.object({
  fechaRegistro: z.string().datetime(),
  estado: z.enum(['PENDIENTE', 'ACEPTADO', 'RECHAZADO']),
  motivoRechazo: z.string().optional().nullable()
});

// Esquema para Detalle de Elección
export const esquemaDetalleEleccion = z.object({
  eleccion: esquemaEleccion,
  partidos: z.array(esquemaPartido),
  registro: esquemaRegistroVotante.optional().nullable(),
  resultados: esquemaResultados.optional().nullable()
});

// Validar datos desde el servidor
export function validarDatos(datos, esquema) {
  try {
    return esquema.parse(datos);
  } catch (error) {
    console.error('Error de validación:', error);
    throw new Error('Los datos recibidos no son válidos');
  }
}