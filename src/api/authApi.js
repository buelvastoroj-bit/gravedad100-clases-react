/**
 * Cliente HTTP del recurso "Autenticacion" (integracion con la API REST
 * real construida en la evidencia AA5_EV01, com.gravedad100-api).
 *
 * Sigue el mismo patron que clasesApi.js: centraliza el manejo de
 * errores HTTP, lanzando un Error con el mensaje que devuelve la API.
 *
 * A partir de esta version, iniciarSesion guarda el token recibido en
 * sesion.js, para que clasesApi.js lo pueda usar automaticamente en las
 * peticiones que lo requieren.
 */
import { establecerToken } from "./sesion.js";

const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function solicitar(ruta, opciones = {}) {
  const respuesta = await fetch(`${URL_BASE}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  const cuerpo = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(cuerpo.mensaje || `Error HTTP ${respuesta.status}`);
    error.status = respuesta.status;
    throw error;
  }
  return cuerpo;
}

/** POST /api/registro -> { mensaje, usuario } */
export function registrarUsuario(usuario, contrasena) {
  return solicitar("/api/registro", {
    method: "POST",
    body: JSON.stringify({ usuario, contrasena }),
  });
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