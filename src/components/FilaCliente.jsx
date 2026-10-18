import { capitalizar, iniciales } from "../utils/formatoClases.js";

// Muestra la fecha de registro como "10 sept 2026". Si no se puede leer, la deja igual.
function formatearFecha(valor) {
  if (!valor) return "—";
  // Una fecha sin hora ("2026-09-10") se lee como hora local para que no cambie de dia
  const texto = /^\d{4}-\d{2}-\d{2}$/.test(valor) ? `${valor}T00:00:00` : valor;
  const fecha = new Date(texto);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Fila de la tabla de clientes registrados.
 * Cada celda lleva "data-label" para que en celular la fila se vea como tarjeta.
 *
 * @param {{
 *   cliente: {idCliente: number, nombre: string, documento: string, telefono: string, fechaRegistro: string},
 *   onCheckin: (idCliente: number) => void
 * }} props
 */
export default function FilaCliente({ cliente, onCheckin }) {
  const nombre = capitalizar(cliente.nombre);

  return (
    <tr>
      <td data-label="ID" className="tabla-clases__id">{cliente.idCliente}</td>
      <td data-label="Nombre">
        <div className="celda-persona">
          <span className="celda-persona__avatar" aria-hidden="true">{iniciales(cliente.nombre)}</span>
          <span className="tabla-clases__nombre">{nombre}</span>
        </div>
      </td>
      <td data-label="Documento" className="tabla-clases__dato">{cliente.documento}</td>
      <td data-label="Teléfono" className="tabla-clases__dato">{cliente.telefono || "—"}</td>
      <td data-label="Registro" className="celda-tenue">{formatearFecha(cliente.fechaRegistro)}</td>
      <td data-label="Acciones">
        <div className="fila-clase__acciones">
          <button
            type="button"
            className="boton boton--primario boton--pequeno"
            onClick={() => onCheckin(cliente.idCliente)}
            aria-label={`Registrar ingreso de ${nombre}`}
          >
            Check-in
          </button>
        </div>
      </td>
    </tr>
  );
}
