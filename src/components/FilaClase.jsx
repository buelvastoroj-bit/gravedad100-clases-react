import BadgeEstadoCupo from "./BadgeEstadoCupo.jsx";

/**
 * Fila de la tabla de clases programadas.
 *
 * @param {{
 *   clase: import('../data/ClaseGrupal.js').ClaseGrupal,
 *   onEditar: (idClase: number) => void,
 *   onSolicitarEliminar: (idClase: number) => void
 * }} props
 */
export default function FilaClase({ clase, onEditar, onSolicitarEliminar }) {
  return (
    <tr>
      <td>{clase.idClase}</td>
      <td>{clase.nombre}</td>
      <td>{clase.entrenador}</td>
      <td>{clase.diaSemana}</td>
      <td>
        {clase.horaInicio} - {clase.horaFin}
      </td>
      <td>
        {clase.cupoOcupado} / {clase.cupoMaximo}
      </td>
      <td>
        <BadgeEstadoCupo clase={clase} />
      </td>
      <td className="fila-clase__acciones">
        <button type="button" className="enlace" onClick={() => onEditar(clase.idClase)}>
          Editar
        </button>
        <button
          type="button"
          className="boton boton--peligro boton--pequeno"
          onClick={() => onSolicitarEliminar(clase.idClase)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
}
