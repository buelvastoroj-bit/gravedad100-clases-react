// Utilidades para presentar los datos de las clases de forma consistente.
// No modifican los datos guardados en la API, solo como se muestran.

const DIAS_SEMANA = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
const NOMBRES_DIA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Quita tildes, espacios sobrantes y pasa a minusculas (para comparar textos)
export function normalizarTexto(texto) {
  return String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// "body pump" -> "Body Pump", "LUIS" -> "Luis"
export function capitalizar(texto) {
  return String(texto ?? "")
    .trim()
    .split(/\s+/)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");
}

// "perder PESO" -> "Perder peso" (solo la primera letra en mayuscula)
export function capitalizarFrase(texto) {
  const limpio = String(texto ?? "").trim();
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
}

// "jean carlos buelvas" -> "JC"
export function iniciales(nombre) {
  return String(nombre ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join("");
}

// "6:00" -> "06:00", para poder comparar horas como texto
function normalizarHora(hora) {
  const [horas = "0", minutos = "0"] = String(hora ?? "").split(":");
  return `${horas.padStart(2, "0")}:${minutos.padStart(2, "0")}`;
}

// 0 = domingo ... 6 = sabado (igual que Date.getDay). -1 si no se reconoce
export function indiceDia(diaSemana) {
  return DIAS_SEMANA.indexOf(normalizarTexto(diaSemana));
}

// Nombre del dia bien escrito a partir de su indice: 3 -> "Miércoles"
export function nombreDia(indice) {
  return NOMBRES_DIA[indice] ?? "";
}

// "miercoles" -> "Miércoles". Si no lo reconoce, solo lo capitaliza
export function nombreDiaClase(diaSemana) {
  const indice = indiceDia(diaSemana);
  return indice === -1 ? capitalizar(diaSemana) : NOMBRES_DIA[indice];
}

// Orden de la semana empezando en lunes (para listas y filtros)
export function ordenSemana(indice) {
  return (indice + 6) % 7;
}

export function nombreDiaHoy(ahora = new Date()) {
  return NOMBRES_DIA[ahora.getDay()];
}

/**
 * Calcula el estado del cupo de una clase.
 * tipo: "disponible" | "pocos" | "lleno" (se usa para los colores)
 */
export function estadoCupo(clase) {
  const maximo = Number(clase.cupoMaximo) || 0;
  const ocupado = Number(clase.cupoOcupado) || 0;
  const disponibles = Math.max(maximo - ocupado, 0);
  const porcentaje = maximo > 0 ? Math.min(100, Math.round((ocupado / maximo) * 100)) : 0;

  if (disponibles === 0) {
    return { tipo: "lleno", texto: "Completo", detalle: "Sin cupos disponibles", porcentaje: 100 };
  }

  const detalle = disponibles === 1 ? "1 disponible" : `${disponibles} disponibles`;

  if (porcentaje >= 80 || (disponibles <= 2 && porcentaje >= 50)) {
    return {
      tipo: "pocos",
      texto: disponibles === 1 ? "Último cupo" : "Últimos cupos",
      detalle,
      porcentaje,
    };
  }

  return { tipo: "disponible", texto: "Con cupo", detalle, porcentaje };
}

export function clasesDeHoy(clases, ahora = new Date()) {
  return clases.filter((clase) => indiceDia(clase.diaSemana) === ahora.getDay());
}

export function contarEntrenadores(clases) {
  const nombres = clases.map((clase) => normalizarTexto(clase.entrenador)).filter(Boolean);
  return new Set(nombres).size;
}

/**
 * Ordena las clases segun cuando ocurren a partir de ahora.
 * Devuelve objetos { clase, diasFaltan } (0 = hoy, 1 = manana...).
 * Una clase de hoy que ya termino pasa a la proxima semana.
 */
export function proximasClases(clases, ahora = new Date()) {
  const hoy = ahora.getDay();
  const horaActual = normalizarHora(`${ahora.getHours()}:${ahora.getMinutes()}`);

  return clases
    .map((clase) => {
      const dia = indiceDia(clase.diaSemana);
      if (dia === -1) return null;
      let diasFaltan = (dia - hoy + 7) % 7;
      if (diasFaltan === 0 && normalizarHora(clase.horaFin) <= horaActual) {
        diasFaltan = 7;
      }
      return { clase, diasFaltan };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        a.diasFaltan - b.diasFaltan ||
        normalizarHora(a.clase.horaInicio).localeCompare(normalizarHora(b.clase.horaInicio))
    );
}

export function etiquetaDia(diasFaltan, diaSemana) {
  if (diasFaltan === 0) return "Hoy";
  if (diasFaltan === 1) return "Mañana";
  return nombreDiaClase(diaSemana);
}
