import { capitalizar, capitalizarFrase, iniciales, normalizarTexto } from "../utils/formatoClases.js";


/**
 * Fila de la tabla de solicitudes de atencion.
 * El asunto y la descripcion van juntos en una sola celda para ahorrar espacio.
 * Cada celda lleva "data-label" para que en celular la fila se vea como tarjeta.
 *
 * @param {{
 *   solicitud: Object,
 *   onResolver: (solicitud: Object) => void
 * }} props
 */
export default function FilaSolicitud({ solicitud, onResolver }) {
  const pendiente = normalizarTexto(solicitud.estado) === "pendiente";
  const cliente = capitalizar(solicitud.nombreCliente);

  return (
    <tr className={pendiente ? "fila-pendiente" : ""}>
      <td data-label="ID" className="tabla-clases__id">{solicitud.idSolicitud}</td>
      <td data-label="Cliente">
        <div className="celda-persona">
          <span className="celda-persona__avatar" aria-hidden="true">{iniciales(solicitud.nombreCliente)}</span>
          <span className="tabla-clases__nombre">{cliente}</span>
        </div>
      </td>
      <td data-label="Solicitud">
        <div className="celda-solicitud">
          <span className="celda-solicitud__asunto">{capitalizarFrase(solicitud.asunto)}</span>
          {solicitud.descripcion && (
            <span className="celda-solicitud__descripcion">{capitalizarFrase(solicitud.descripcion)}</span>
          )}
        </div>
      </td>
      <td data-label="Estado">
        <span className={`estado-badge ${pendiente ? "estado-badge--pendiente" : "estado-badge--resuelta"}`}>
          <span className="estado-badge__punto" aria-hidden="true" />
          {capitalizar(solicitud.estado)}
        </span>
      </td>
      <td data-label="Respuesta" className="celda-observaciones">
        {solicitud.respuesta ? capitalizarFrase(solicitud.respuesta) : "—"}
      </td>
      <td data-label="Acciones">
        <div className="fila-clase__acciones">
          {pendiente ? (
            <button
              type="button"
              className="boton boton--primario boton--pequeno"
              onClick={() => onResolver(solicitud)}
              aria-label={`Resolver solicitud de ${cliente}`}
            >
              Resolver
            </button>
          ) : (
            <span className="celda-tenue">Atendida</span>
          )}
        </div>
      </td>
    </tr>
  );
}
