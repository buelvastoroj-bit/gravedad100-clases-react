/**
 * Cliente HTTP del recurso "Autenticacion" (integracion con la API REST
 * real construida en la evidencia AA5_EV01, com.gravedad100-api).
 *
 * Sigue el mismo patron que clasesApi.js: centraliza el manejo de
 * errores HTTP, lanzando un Error con el mensaje que devuelve la API.
 *
 * iniciarSesion guarda el token recibido en sesion.js, para que los demas
 * clientes HTTP lo puedan usar automaticamente en las peticiones que lo requieren.
 *
 * Desde que el registro publico se cierra (cuando ya existen usuarios),
 * registrarUsuario envia el token de la sesion si hay uno, para que un
 * usuario con sesion iniciada pueda crear cuentas nuevas.
 */
import { establecerToken, obtenerToken } from "./sesion.js";

const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function solicitar(ruta, opciones = {}) {
  const { headers: headersExtra, ...restoOpciones } = opciones;
  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    ...restoOpciones,
    headers: {
      "Content-Type": "application/json",
      ...headersExtra,
    },
  });
  const cuerpo = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(cuerpo.mensaje || `Error HTTP ${respuesta.status}`);
    error.status = respuesta.status;
    throw error;
  }
  return cuerpo;
}

function encabezadosAutenticados() {
  const token = obtenerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * POST /api/registro -> { mensaje, usuario }
 * Publico solo si no hay usuarios; despues requiere token (se envia si existe).
 */
export function registrarUsuario(usuario, contrasena) {
  return solicitar("/api/registro", {
    method: "POST",
    headers: encabezadosAutenticados(),
    body: JSON.stringify({ usuario, contrasena }),
  });
}

/** GET /api/registro/estado -> { registroAbierto } */
export function obtenerEstadoRegistro() {
  return solicitar("/api/registro/estado");
}

/** POST /api/login -> { mensaje, token }. Guarda el token recibido. */
export async function iniciarSesion(usuario, contrasena) {
  const respuesta = await solicitar("/api/login", {
    method: "POST",
    body: JSON.stringify({ usuario, contrasena }),
  });
  establecerToken(respuesta.token);
  return respuesta;
}
