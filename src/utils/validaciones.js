/**
 * Validaciones del formulario de "Programar / Editar clase".
 *
 * Estas reglas replican, del lado del cliente, las mismas validaciones
 * que ya se probaron en el backend (ClaseServicio.validarDatosObligatorios,
 * evidencia AA3_EV02): campos obligatorios, cupo maximo mayor que cero,
 * y limites de longitud de la base de datos (VARCHAR(60) y VARCHAR(100)).
 * Se agrega ademas la validacion de coherencia de horario (hora fin
 * posterior a hora inicio), identificada como hallazgo de mejora durante
 * las pruebas del backend y corregida aqui en el frontend.
 */

export const LONGITUD_MAXIMA_NOMBRE = 60;
export const LONGITUD_MAXIMA_ENTRENADOR = 100;

/**
 * Valida los datos de una clase antes de guardarla.
 *
 * @param {{nombre:string, entrenador:string, diaSemana:string, horaInicio:string, horaFin:string, cupoMaximo:number|string}} datos
 * @returns {Object} Un objeto con un mensaje de error por cada campo invalido.
 *                    Si el objeto retornado esta vacio, los datos son validos.
 */
export function validarClase(datos) {
  const errores = {};

  if (!datos.nombre || !datos.nombre.trim()) {
    errores.nombre = "El nombre de la clase es obligatorio.";
  } else if (datos.nombre.trim().length > LONGITUD_MAXIMA_NOMBRE) {
    errores.nombre = `El nombre no puede superar los ${LONGITUD_MAXIMA_NOMBRE} caracteres.`;
  }

  if (!datos.entrenador || !datos.entrenador.trim()) {
    errores.entrenador = "El entrenador es obligatorio.";
  } else if (datos.entrenador.trim().length > LONGITUD_MAXIMA_ENTRENADOR) {
    errores.entrenador = `El entrenador no puede superar los ${LONGITUD_MAXIMA_ENTRENADOR} caracteres.`;
  }

  if (!datos.diaSemana) {
    errores.diaSemana = "Selecciona un dia de la semana.";
  }

  if (!datos.horaInicio) {
    errores.horaInicio = "La hora de inicio es obligatoria.";
  }

  if (!datos.horaFin) {
    errores.horaFin = "La hora de fin es obligatoria.";
  }

  if (
    datos.horaInicio &&
    datos.horaFin &&
    datos.horaFin <= datos.horaInicio
  ) {
    errores.horaFin = "La hora de fin debe ser posterior a la hora de inicio.";
  }

  const cupoVacio =
    datos.cupoMaximo === "" ||
    datos.cupoMaximo === undefined ||
    datos.cupoMaximo === null;
  const cupo = Number(datos.cupoMaximo);
  if (cupoVacio || Number.isNaN(cupo)) {
    errores.cupoMaximo = "El cupo maximo es obligatorio.";
  } else if (cupo < 1) {
    errores.cupoMaximo = "El cupo maximo debe ser mayor que cero.";
  }

  return errores;
}

/**
 * Atajo para saber si un conjunto de errores esta vacio (datos validos).
 * @param {Object} errores
 * @returns {boolean}
 */
export function esValido(errores) {
  return Object.keys(errores).length === 0;
}
