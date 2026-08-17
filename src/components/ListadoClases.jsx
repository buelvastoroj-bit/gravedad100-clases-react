import FilaClase from "./FilaClase.jsx";

/**
 * Tabla con el listado completo de clases programadas (HU-01).
 * Si no hay clases registradas, invita al usuario a programar la primera.
 *
 * @param {{
 *   clases: Array,
 *   onEditar: (idClase: number) => void,
 *   onSolicitarEliminar: (idClase: number) => void,
 *   onProgramarNueva: () => void
 * }} props
 */
export default function ListadoClases({ clases, onEditar, onSolicitarEliminar, onProgramarNueva }) {
  return (
    <section className="listado-clases">
      <div className="listado-clases__cabecera">
        <h2>Clases programadas</h2>
        <button type="button" className="boton boton--primario" onClick={onProgramarNueva}>
          + Programar nueva clase
        </button>
      </div>

      <p className="listado-clases__contador">Total de clases: {clases.length}</p>

      {clases.length === 0 ? (
        <p className="listado-clases__vacio">
          Aun no hay clases programadas.{" "}
          <button type="button" className="enlace" onClick={onProgramarNueva}>
            Programar la primera
          </button>
          .
        </p>
      ) : (
        <table className="tabla-clases">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Entrenador</th>
              <th>Dia</th>
              <th>Horario</th>
              <th>Cupo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.map((clase) => (
              <FilaClase
                key={clase.idClase}
                clase={clase}
                onEditar={onEditar}
                onSolicitarEliminar={onSolicitarEliminar}
              />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
