/**
 * Cliente HTTP del recurso "Planes de entrenamiento" (modulo de
 * Entrenamiento personalizado, RF-03), siguiendo el mismo patron que
 * clientesApi.js.
 */
import { obtenerToken } from "./sesion.js";

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

/** GET /api/planes-entrenamiento -> { total, planes } (no requiere token) */
export function obtenerPlanes() {
  return solicitar("/api/planes-entrenamiento");
}

/** POST /api/planes-entrenamiento -> { mensaje, plan } (requiere token) */
export function crearPlan(datos) {
  return solicitar("/api/planes-entrenamiento", {
    method: "POST",
    headers: encabezadosAutenticados(),
    body: JSON.stringify(datos),
  });
}

/** DELETE /api/planes-entrenamiento/:id -> { mensaje } (requiere token) */
export function eliminarPlan(idPlan) {
  return solicitar(`/api/planes-entrenamiento/${idPlan}`, {
    method: "DELETE",
    headers: encabezadosAutenticados(),
  });
}