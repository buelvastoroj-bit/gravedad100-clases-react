/**
 * Cliente HTTP del recurso "Clases" (integracion con la API REST real
 * construida en la evidencia AA5_EV03, com.gravedad100-api).
 *
 * Reemplaza el estado local en memoria usado en la version inicial del
 * componente (evidencia AA4_EV03) por llamadas fetch a la API real,
 * completando la integracion de los modulos frontend y backend del
 * proyecto (evidencia GA8_AA1_EV01).
 */

const URL_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

/**
 * Envoltorio de fetch que centraliza el manejo de errores HTTP: si la
 * respuesta no es exitosa (status fuera del rango 2xx), lanza un Error
 * cuyo mensaje viene del cuerpo JSON de la API, para que la capa de
 * estado (useClases) lo pueda mostrar tal cual al usuario.
 */
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

/** GET /api/clases -> { total, clases } */
export function obtenerClases() {
  return solicitar("/api/clases");
}

/** POST /api/clases -> { mensaje, clase } */
export function crearClase(datos) {
  return solicitar("/api/clases", {
    method: "POST",
    body: JSON.stringify(datos),
  });
}

/** PUT /api/clases/:id -> { mensaje, clase } */
export function actualizarClase(idClase, datos) {
  return solicitar(`/api/clases/${idClase}`, {
    method: "PUT",
    body: JSON.stringify(datos),
  });
}

/** DELETE /api/clases/:id -> { mensaje } */
export function eliminarClase(idClase) {
  return solicitar(`/api/clases/${idClase}`, { method: "DELETE" });
}
