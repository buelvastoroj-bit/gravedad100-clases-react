/**
 * Cliente HTTP del recurso "Clases" (integracion con la API REST real
 * construida en la evidencia AA5_EV03, com.gravedad100-api).
 *
 * A partir de esta version, las operaciones que modifican datos (crear,
 * editar, eliminar) envian automaticamente el token de sesion guardado
 * en sesion.js, ya que la API ahora los exige.
 */
import { obtenerToken } from "./sesion.js";

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
    error.errores = cuerpo.errores;
    throw error;
  }
  return cuerpo;
}

/** Agrega la cabecera Authorization si hay un token de sesion guardado. */
function encabezadosAutenticados() {
  const token = obtenerToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** GET /api/clases -> { total, clases } (no requiere token) */
export function obtenerClases() {
  return solicitar("/api/clases");
}

/** POST /api/clases -> { mensaje, clase } (requiere token) */
export function crearClase(datos) {
  return solicitar("/api/clases", {
    method: "POST",
    headers: encabezadosAutenticados(),
    body: JSON.stringify(datos),
  });
}

/** PUT /api/clases/:id -> { mensaje, clase } (requiere token) */
export function actualizarClase(idClase, datos) {
  return solicitar(`/api/clases/${idClase}`, {
    method: "PUT",
    headers: encabezadosAutenticados(),
    body: JSON.stringify(datos),
  });
}

/** DELETE /api/clases/:id -> { mensaje } (requiere token) */
export function eliminarClase(idClase) {
  return solicitar(`/api/clases/${idClase}`, {
    method: "DELETE",
    headers: encabezadosAutenticados(),
  });
}