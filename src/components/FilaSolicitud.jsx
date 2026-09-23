/**
 * Fila de la tabla de solicitudes de atencion.
 *
 * @param {{
 *   solicitud: Object,
 *   onResolver: (solicitud: Object) => void
 * }} props
 */
export default function FilaSolicitud({ solicitud, onResolver }) {
  const esPendiente = solicitud.estado === "Pendiente";

  return (
    <tr>
      <td>{solicitud.idSolicitud}</td>
      <td>{solicitud.nombreCliente}</td>
      <td>{solicitud.asunto}</td>
      <td>{solicitud.descripcion}</td>
      <td>
        <span className={`badge-cupo ${esPendiente ? "badge-cupo--lleno" : "badge-cupo--disponible"}`}>
          <span className="badge-cupo__disco" />
          {solicitud.estado}
        </span>
      </td>
      <td>{solicitud.respuesta || "—"}</td>
      <td className="fila-clase__acciones">
        {esPendiente && (
          <button
            type="button"
            className="boton boton--primario boton--pequeno"
            onClick={() => onResolver(solicitud)}
          >
            Resolver
          </button>
        )}
      </td>
    </tr>
  );
}