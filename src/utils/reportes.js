// Calculos para la pantalla de Reportes.
// Todo sale de los datos que ya entrega la API; aqui solo se cuentan y agrupan.

import { capitalizar, estadoCupo, indiceDia, ordenSemana } from "./formatoClases.js";

// Dias en orden de lunes a domingo (como se usan en Colombia)
const DIAS_CORTOS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Franjas horarias para la asistencia (hora local)
const FRANJAS = [
  { desde: 5, hasta: 8, etiqueta: "5–8" },
  { desde: 8, hasta: 11, etiqueta: "8–11" },
  { desde: 11, hasta: 14, etiqueta: "11–14" },
  { desde: 14, hasta: 17, etiqueta: "14–17" },
  { desde: 17, hasta: 20, etiqueta: "17–20" },
  { desde: 20, hasta: 23, etiqueta: "20–23" },
];

export const PERIODOS = [
  { valor: "7", etiqueta: "Últimos 7 días", dias: 7 },
  { valor: "30", etiqueta: "Últimos 30 días", dias: 30 },
  { valor: "todo", etiqueta: "Todo el historial", dias: null },
];

// Convierte un texto de fecha en Date. Devuelve null si no se puede leer.
// Una fecha sin hora ("2026-09-10") se toma como hora local para que no cambie de dia.
export function leerFecha(valor) {
  if (!valor) return null;
  const texto = /^\d{4}-\d{2}-\d{2}$/.test(valor) ? `${valor}T00:00:00` : valor;
  const fecha = new Date(texto);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

// Fechas de los check-ins dentro del periodo elegido (dias = null es todo)
export function fechasCheckinsEnPeriodo(checkins, dias, ahora = new Date()) {
  const fechas = checkins
    .map((checkin) => ({ idCliente: checkin.idCliente, fecha: leerFecha(checkin.fechaHora) }))
    .filter((registro) => registro.fecha);

  if (!dias) return fechas;

  const limite = new Date(ahora);
  limite.setHours(0, 0, 0, 0);
  limite.setDate(limite.getDate() - (dias - 1));
  return fechas.filter((registro) => registro.fecha >= limite);
}

// Cantidad de registros por dia de la semana, de lunes a domingo
export function contarPorDiaSemana(registros) {
  const conteo = new Array(7).fill(0);
  registros.forEach(({ fecha }) => {
    conteo[ordenSemana(fecha.getDay())] += 1;
  });
  return DIAS_CORTOS.map((etiqueta, i) => ({ etiqueta, valor: conteo[i] }));
}

// Cantidad de registros por franja horaria. Lo que caiga fuera queda en "Otras"
export function contarPorFranja(registros) {
  const resultado = FRANJAS.map((franja) => ({ etiqueta: franja.etiqueta, valor: 0 }));
  let otras = 0;
  registros.forEach(({ fecha }) => {
    const hora = fecha.getHours();
    const indice = FRANJAS.findIndex((franja) => hora >= franja.desde && hora < franja.hasta);
    if (indice === -1) otras += 1;
    else resultado[indice].valor += 1;
  });
  if (otras > 0) resultado.push({ etiqueta: "Otras", valor: otras });
  return resultado;
}

// Clientes con mas check-ins en el periodo
export function clientesMasFrecuentes(registros, clientes, limite = 5) {
  const conteo = new Map();
  registros.forEach(({ idCliente }) => conteo.set(idCliente, (conteo.get(idCliente) ?? 0) + 1));

  return [...conteo.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite)
    .map(([idCliente, visitas]) => {
      const cliente = clientes.find((c) => c.idCliente === idCliente);
      return {
        idCliente,
        nombre: cliente ? capitalizar(cliente.nombre) : `Cliente #${idCliente}`,
        visitas,
      };
    });
}

// Ocupacion de todas las clases juntas, en porcentaje. null si no hay cupos
export function ocupacionPromedio(clases) {
  const totalMaximo = clases.reduce((suma, clase) => suma + (Number(clase.cupoMaximo) || 0), 0);
  const totalOcupado = clases.reduce((suma, clase) => suma + (Number(clase.cupoOcupado) || 0), 0);
  if (totalMaximo === 0) return null;
  return Math.round((totalOcupado / totalMaximo) * 100);
}

// Clases ordenadas de la mas llena a la menos llena
export function clasesMasLlenas(clases, limite = 5) {
  return [...clases]
    .map((clase) => ({ clase, estado: estadoCupo(clase) }))
    .sort((a, b) => b.estado.porcentaje - a.estado.porcentaje)
    .slice(0, limite);
}

// Cantidad de clases programadas cada dia, de lunes a domingo
export function clasesPorDia(clases) {
  const conteo = new Array(7).fill(0);
  clases.forEach((clase) => {
    const indice = indiceDia(clase.diaSemana);
    if (indice !== -1) conteo[ordenSemana(indice)] += 1;
  });
  return DIAS_CORTOS.map((etiqueta, i) => ({ etiqueta, valor: conteo[i] }));
}

// Clientes registrados en cada uno de los ultimos meses
export function registrosPorMes(clientes, meses = 6, ahora = new Date()) {
  const resultado = [];
  for (let i = meses - 1; i >= 0; i -= 1) {
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const nombreMes = inicio.toLocaleDateString("es-CO", { month: "short" }).replace(".", "");
    resultado.push({
      etiqueta: nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1),
      anio: inicio.getFullYear(),
      mes: inicio.getMonth(),
      valor: 0,
    });
  }

  clientes.forEach((cliente) => {
    const fecha = leerFecha(cliente.fechaRegistro);
    if (!fecha) return;
    const grupo = resultado.find((r) => r.anio === fecha.getFullYear() && r.mes === fecha.getMonth());
    if (grupo) grupo.valor += 1;
  });

  return resultado.map(({ etiqueta, valor }) => ({ etiqueta, valor }));
}
