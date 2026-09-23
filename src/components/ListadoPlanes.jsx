import FilaPlan from "./FilaPlan.jsx";

/**
 * Tabla con el listado de planes de entrenamiento personalizado (RF-03).
 *
 * @param {{
 *   planes: Array,
 *   onSolicitarEliminar: (idPlan: number) => void,
 *   onCrearNuevo: () => void
 * }} props
 */
export default function ListadoPlanes({ planes, onSolicitarEliminar, onCrearNuevo }) {
  return (
    <section className="listado-clases">
      <div className="listado-clases__cabecera">
        <h2>Planes de entrenamiento</h2>
        <button type="button" className="boton boton--primario" onClick={onCrearNuevo}>
          + Nuevo plan
        </button>
      </div>

      <p className="listado-clases__contador">Total de planes: {planes.length}</p>

      {planes.length === 0 ? (
        <p className="listado-clases__vacio">
          Aun no hay planes de entrenamiento creados.{" "}
          <button type="button" className="enlace" onClick={onCrearNuevo}>
            Crear el primero
          </button>
          .
        </p>
      ) : (
        <table className="tabla-clases">
          <thead>
            <tr>
              <th>Id</th>
              <th>Cliente</th>
              <th>Objetivo</th>
              <th>Nivel</th>
              <th>Duracion</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planes.map((plan) => (
              <FilaPlan key={plan.idPlan} plan={plan} onSolicitarEliminar={onSolicitarEliminar} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}