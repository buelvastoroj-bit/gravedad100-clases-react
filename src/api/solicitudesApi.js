/**
 * Cliente HTTP del recurso "Solicitudes de atencion" (RF-04), siguiendo
 * el mismo patron que clientesApi.js.
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

/** GET /api/solicitudes -> { total, solicitudes } (no requiere token) */
export function obtenerSolicitudes() {
  return solicitar("/api/solicitudes");
}

/** POST /api/solicitudes -> { mensaje, solicitud } (requiere token) */
export function registrarSolicitud(datos) {
  return solicitar("/api/solicitudes", {
    method: "POST",
    headers: encabezadosAutenticados(),
    body: JSON.stringify(datos),
  });
}

/** PUT /api/solicitudes/:id/resolver -> { mensaje, solicitud } (requiere token) */
export function resolverSolicitud(idSolicitud, respuesta) {
  return solicitar(`/api/solicitudes/${idSolicitud}/resolver`, {
    method: "PUT",
    headers: encabezadosAutenticados(),
    body: JSON.stringify({ respuesta }),
  });
}