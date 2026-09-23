import FilaSolicitud from "./FilaSolicitud.jsx";

/**
 * Tabla con el listado de solicitudes de atencion al cliente (RF-04).
 *
 * @param {{
 *   solicitudes: Array,
 *   onResolver: (solicitud: Object) => void,
 *   onRegistrarNueva: () => void
 * }} props
 */
export default function ListadoSolicitudes({ solicitudes, onResolver, onRegistrarNueva }) {
  const pendientes = solicitudes.filter((s) => s.estado === "Pendiente").length;

  return (
    <section className="listado-clases">
      <div className="listado-clases__cabecera">
        <h2>Solicitudes de atención</h2>
        <button type="button" className="boton boton--primario" onClick={onRegistrarNueva}>
          + Nueva solicitud
        </button>
      </div>

      <p className="listado-clases__contador">
        Total: {solicitudes.length} · Pendientes: {pendientes}
      </p>

      {solicitudes.length === 0 ? (
        <p className="listado-clases__vacio">
          Aun no hay solicitudes registradas.{" "}
          <button type="button" className="enlace" onClick={onRegistrarNueva}>
            Registrar la primera
          </button>
          .
        </p>
      ) : (
        <table className="tabla-clases">
          <thead>
            <tr>
              <th>Id</th>
              <th>Cliente</th>
              <th>Asunto</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Respuesta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <FilaSolicitud key={s.idSolicitud} solicitud={s} onResolver={onResolver} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}