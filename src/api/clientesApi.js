/**
 * Cliente HTTP del recurso "Clientes" (modulo de Recepcion de clientes,
 * RF-01), siguiendo el mismo patron que clasesApi.js.
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

/** GET /api/clientes -> { total, clientes } (no requiere token) */
export function obtenerClientes() {
  return solicitar("/api/clientes");
}

/** POST /api/clientes -> { mensaje, cliente } (requiere token) */
export function registrarCliente(datos) {
  return solicitar("/api/clientes", {
    method: "POST",
    headers: encabezadosAutenticados(),
    body: JSON.stringify(datos),
  });
}

/** POST /api/clientes/:id/checkin -> { mensaje, checkin } (requiere token) */
export function registrarCheckin(idCliente) {
  return solicitar(`/api/clientes/${idCliente}/checkin`, {
    method: "POST",
    headers: encabezadosAutenticados(),
  });
}

/** GET /api/checkins -> { total, checkins } (no requiere token) */
export function obtenerCheckins() {
  return solicitar("/api/checkins");
}