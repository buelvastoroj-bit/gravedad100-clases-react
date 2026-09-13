/**
 * Fila de la tabla de clientes registrados.
 *
 * @param {{
 *   cliente: {idCliente: number, nombre: string, documento: string, telefono: string, fechaRegistro: string},
 *   onCheckin: (idCliente: number) => void
 * }} props
 */
export default function FilaCliente({ cliente, onCheckin }) {
  return (
    <tr>
      <td>{cliente.idCliente}</td>
      <td>{cliente.nombre}</td>
      <td>{cliente.documento}</td>
      <td>{cliente.telefono || "—"}</td>
      <td className="fila-clase__acciones">
        <button
          type="button"
          className="boton boton--primario boton--pequeno"
          onClick={() => onCheckin(cliente.idCliente)}
        >
          Check-in
        </button>
      </td>
    </tr>
  );
}