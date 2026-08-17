/**
 * Datos de ejemplo (seed) con los que arranca el prototipo del frontend.
 *
 * En esta evidencia el componente trabaja con estado local en memoria
 * (useState/useReducer), tal como se definio en el alcance de la
 * codificacion del componente frontend con React JS. La integracion con
 * el backend real (Spring MVC + JDBC, ya construido y probado en las
 * evidencias AA3_EV01 y AA3_EV02) queda planteada como siguiente paso,
 * reemplazando estos datos de ejemplo por llamadas fetch a los endpoints
 * ya mapeados en ClaseController (/clases, /clases/nueva, etc.).
 */
export const CLASES_INICIALES = [
  {
    idClase: 1,
    nombre: "Spinning",
    entrenador: "Carlos Perez",
    diaSemana: "Lunes",
    horaInicio: "06:00",
    horaFin: "07:00",
    cupoMaximo: 15,
    cupoOcupado: 9,
  },
  {
    idClase: 2,
    nombre: "Yoga",
    entrenador: "Laura Gomez",
    diaSemana: "Martes",
    horaInicio: "07:00",
    horaFin: "08:00",
    cupoMaximo: 10,
    cupoOcupado: 10,
  },
  {
    idClase: 3,
    nombre: "Body pump",
    entrenador: "Angel Ramirez",
    diaSemana: "Miercoles",
    horaInicio: "18:00",
    horaFin: "19:00",
    cupoMaximo: 12,
    cupoOcupado: 4,
  },
];
