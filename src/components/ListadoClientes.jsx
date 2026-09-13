import FilaCliente from "./FilaCliente.jsx";

/**
 * Tabla con el listado completo de clientes registrados en recepcion
 * (RF-01). Sigue el mismo patron que ListadoClases.jsx.
 *
 * @param {{
 *   clientes: Array,
 *   onCheckin: (idCliente: number) => void,
 *   onRegistrarNuevo: () => void
 * }} props
 */
export default function ListadoClientes({ clientes, onCheckin, onRegistrarNuevo }) {
  return (
    <section className="listado-clases">
      <div className="listado-clases__cabecera">
        <h2>Clientes registrados</h2>
        <button type="button" className="boton boton--primario" onClick={onRegistrarNuevo}>
          + Registrar cliente
        </button>
      </div>

      <p className="listado-clases__contador">Total de clientes: {clientes.length}</p>

      {clientes.length === 0 ? (
        <p className="listado-clases__vacio">
          Aun no hay clientes registrados.{" "}
          <button type="button" className="enlace" onClick={onRegistrarNuevo}>
            Registrar el primero
          </button>
          .
        </p>
      ) : (
        <table className="tabla-clases">
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Telefono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <FilaCliente key={cliente.idCliente} cliente={cliente} onCheckin={onCheckin} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}