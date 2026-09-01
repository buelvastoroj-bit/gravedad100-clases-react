/**
 * Cliente HTTP del recurso "Autenticacion" (integracion con la API REST
 * real construida en la evidencia AA5_EV01, com.gravedad100-api).
 *
 * Sigue el mismo patron que clasesApi.js: centraliza el manejo de
 * errores HTTP, lanzando un Error con el mensaje que devuelve la API.
 */

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

/** POST /api/login -> { mensaje } */
export function iniciarSesion(usuario, contrasena) {
  return solicitar("/api/login", {
    method: "POST",
    body: JSON.stringify({ usuario, contrasena }),
  });
}