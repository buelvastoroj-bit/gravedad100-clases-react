/**
 * Fila de la tabla de planes de entrenamiento.
 *
 * @param {{
 *   plan: Object,
 *   onSolicitarEliminar: (idPlan: number) => void
 * }} props
 */
export default function FilaPlan({ plan, onSolicitarEliminar }) {
  return (
    <tr>
      <td>{plan.idPlan}</td>
      <td>{plan.nombreCliente}</td>
      <td>{plan.objetivo}</td>
      <td>{plan.nivel}</td>
      <td>{plan.duracionSemanas} sem.</td>
      <td>{plan.observaciones || "—"}</td>
      <td className="fila-clase__acciones">
        <button
          type="button"
          className="boton boton--peligro boton--pequeno"
          onClick={() => onSolicitarEliminar(plan.idPlan)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}