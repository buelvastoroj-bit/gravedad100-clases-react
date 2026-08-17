/**
 * Modelo de datos de una clase grupal del gimnasio.
 *
 * Refleja exactamente los mismos campos y restricciones que la entidad
 * ClaseGrupal del backend (Spring MVC + Spring JDBC, evidencia AA3_EV01),
 * para que el componente frontend en React sea consistente con las reglas
 * de negocio ya implementadas y probadas del lado del servidor.
 *
 * @typedef {Object} ClaseGrupal
 * @property {number} idClase        - Identificador unico de la clase.
 * @property {string} nombre         - Nombre de la clase (maximo 60 caracteres).
 * @property {string} entrenador     - Nombre del entrenador (maximo 100 caracteres).
 * @property {string} diaSemana      - Dia de la semana en que se dicta la clase.
 * @property {string} horaInicio     - Hora de inicio en formato "HH:mm".
 * @property {string} horaFin        - Hora de fin en formato "HH:mm".
 * @property {number} cupoMaximo     - Cupo maximo de clientes (mayor a 0).
 * @property {number} cupoOcupado    - Cupo actualmente ocupado (0 por defecto).
 */

/** Dias de la semana validos para el selector del formulario. */
export const DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

/**
 * Crea una clase grupal nueva con los valores por defecto del dominio
 * (cupoOcupado siempre inicia en 0, igual que en el backend).
 *
 * @param {Partial<ClaseGrupal>} datos - Datos parciales de la clase.
 * @param {number} idClase - Id que se le asignara a la nueva clase.
 * @returns {ClaseGrupal} La clase grupal completa, lista para guardar.
 */
export function crearClaseGrupal(datos, idClase) {
  return {
    idClase,
    nombre: datos.nombre?.trim() ?? "",
    entrenador: datos.entrenador?.trim() ?? "",
    diaSemana: datos.diaSemana ?? DIAS_SEMANA[0],
    horaInicio: datos.horaInicio ?? "",
    horaFin: datos.horaFin ?? "",
    cupoMaximo: Number(datos.cupoMaximo) || 0,
    cupoOcupado: 0,
  };
}

/**
 * Indica si una clase todavia tiene cupo disponible.
 * Equivalente a ClaseGrupal.isCupoDisponible() del backend.
 *
 * @param {ClaseGrupal} clase
 * @returns {boolean} true si cupoOcupado es menor que cupoMaximo.
 */
export function tieneCupoDisponible(clase) {
  return clase.cupoOcupado < clase.cupoMaximo;
}
