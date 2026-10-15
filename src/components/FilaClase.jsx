import BadgeEstadoCupo from "./BadgeEstadoCupo.jsx";
import BarraOcupacion from "./BarraOcupacion.jsx";
import { capitalizar, estadoCupo, nombreDiaClase } from "../utils/formatoClases.js";

/**
 * Fila de la tabla de clases programadas.
 * Cada celda lleva "data-label" para que en celular la fila se vea como tarjeta.
 *
 * @param {{
 *   clase: import('../data/ClaseGrupal.js').ClaseGrupal,
 *   onEditar: (idClase: number) => void,
 *   onSolicitarEliminar: (idClase: number) => void
 * }} props
 */
export default function FilaClase({ clase, onEditar, onSolicitarEliminar }) {
  const estado = estadoCupo(clase);
  const nombre = capitalizar(clase.nombre);

  return (
    <tr>
      <td data-label="ID" className="tabla-clases__id">{clase.idClase}</td>
      <td data-label="Nombre" className="tabla-clases__nombre">{nombre}</td>
      <td data-label="Entrenador">{capitalizar(clase.entrenador)}</td>
      <td data-label="Día">{nombreDiaClase(clase.diaSemana)}</td>
      <td data-label="Horario" className="tabla-clases__dato">
        {clase.horaInicio} - {clase.horaFin}
      </td>
      <td data-label="Cupo">
        <div className="celda-cupo">
          <span className="celda-cupo__numeros">
            {clase.cupoOcupado} / {clase.cupoMaximo}
          </span>
          <BarraOcupacion porcentaje={estado.porcentaje} tipo={estado.tipo} />
          <span className="celda-cupo__detalle">{estado.detalle}</span>
        </div>
      </td>
      <td data-label="Estado">
        <BadgeEstadoCupo clase={clase} />
      </td>
      <td data-label="Acciones">
        <div className="fila-clase__acciones">
          <button
            type="button"
            className="boton boton--editar boton--pequeno"
            onClick={() => onEditar(clase.idClase)}
            aria-label={`Editar clase ${nombre}`}
          >
            Editar
          </button>
          <button
            type="button"
            className="boton boton--peligro boton--pequeno"
            onClick={() => onSolicitarEliminar(clase.idClase)}
            aria-label={`Eliminar clase ${nombre}`}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
