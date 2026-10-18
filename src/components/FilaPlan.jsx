import { capitalizar, capitalizarFrase, iniciales, normalizarTexto } from "../utils/formatoClases.js";

// Color del badge segun el nivel. Si llega un nivel desconocido, se ve neutro.
const CLASES_NIVEL = {
  principiante: "nivel-badge--principiante",
  intermedio: "nivel-badge--intermedio",
  avanzado: "nivel-badge--avanzado",
};

function textoDuracion(semanas) {
  const numero = Number(semanas);
  if (!numero) return "—";
  return numero === 1 ? "1 semana" : `${numero} semanas`;
}

/**
 * Fila de la tabla de planes de entrenamiento.
 * Cada celda lleva "data-label" para que en celular la fila se vea como tarjeta.
 *
 * @param {{
 *   plan: Object,
 *   onSolicitarEliminar: (idPlan: number) => void
 * }} props
 */
export default function FilaPlan({ plan, onSolicitarEliminar }) {
  const cliente = capitalizar(plan.nombreCliente);
  const claseNivel = CLASES_NIVEL[normalizarTexto(plan.nivel)] ?? "";

  return (
    <tr>
      <td data-label="ID" className="tabla-clases__id">{plan.idPlan}</td>
      <td data-label="Cliente">
        <div className="celda-persona">
          <span className="celda-persona__avatar" aria-hidden="true">{iniciales(plan.nombreCliente)}</span>
          <span className="tabla-clases__nombre">{cliente}</span>
        </div>
      </td>
      <td data-label="Objetivo">{capitalizarFrase(plan.objetivo)}</td>
      <td data-label="Nivel">
        <span className={`nivel-badge ${claseNivel}`}>{capitalizar(plan.nivel)}</span>
      </td>
      <td data-label="Duración" className="tabla-clases__dato">{textoDuracion(plan.duracionSemanas)}</td>
      <td data-label="Observaciones" className="celda-observaciones">
        {plan.observaciones ? capitalizarFrase(plan.observaciones) : "—"}
      </td>
      <td data-label="Acciones">
        <div className="fila-clase__acciones">
          <button
            type="button"
            className="boton boton--peligro boton--pequeno"
            onClick={() => onSolicitarEliminar(plan.idPlan)}
            aria-label={`Eliminar plan de ${cliente}`}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
