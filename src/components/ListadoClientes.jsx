import { useState } from "react";
import FilaCliente from "./FilaCliente.jsx";
import { normalizarTexto } from "../utils/formatoClases.js";

/**
 * Tabla con el listado completo de clientes registrados en recepcion
 * (RF-01). Sigue el mismo patron que ListadoClases.jsx.
 * Incluye buscador por nombre, documento o telefono.
 *
 * @param {{
 *   clientes: Array,
 *   onCheckin: (idCliente: number) => void,
 *   onRegistrarNuevo: () => void
 * }} props
 */
export default function ListadoClientes({ clientes, onCheckin, onRegistrarNuevo }) {
  const [busqueda, setBusqueda] = useState("");

  const texto = normalizarTexto(busqueda);
  const clientesFiltrados = clientes.filter((cliente) => {
    if (!texto) return true;
    return (
      normalizarTexto(cliente.nombre).includes(texto) ||
      normalizarTexto(cliente.documento).includes(texto) ||
      normalizarTexto(cliente.telefono).includes(texto)
    );
  });

  return (
    <section className="listado-clases">
      <div className="encabezado-pagina encabezado-pagina--con-accion">
        <div>
          <h2 className="encabezado-pagina__titulo">Clientes registrados</h2>
          <p className="encabezado-pagina__subtitulo">
            Registra a los clientes y marca su ingreso al gimnasio con el check-in.
          </p>
        </div>
        <button type="button" className="boton boton--primario" onClick={onRegistrarNuevo}>
          + Registrar cliente
        </button>
      </div>

      {clientes.length === 0 ? (
        <div className="estado-vacio">
          <p>Aún no hay clientes registrados.</p>
          <button type="button" className="boton boton--primario" onClick={onRegistrarNuevo}>
            Registrar el primer cliente
          </button>
        </div>
      ) : (
        <>
          <div className="barra-filtros">
            <div className="buscador">
              <svg className="buscador__icono" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                type="search"
                className="buscador__campo"
                placeholder="Buscar por nombre, documento o teléfono..."
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                aria-label="Buscar cliente"
              />
            </div>
          </div>

          <div className="listado-clases__resumen">
            <span className="listado-clases__contador">
              {texto
                ? `Mostrando ${clientesFiltrados.length} de ${clientes.length} clientes`
                : `Total de clientes: ${clientes.length}`}
            </span>
            {texto && (
              <button type="button" className="enlace enlace--pequeno" onClick={() => setBusqueda("")}>
                Limpiar búsqueda
              </button>
            )}
          </div>

          {clientesFiltrados.length === 0 ? (
            <div className="estado-vacio">
              <p>Ningún cliente coincide con la búsqueda.</p>
              <button type="button" className="boton boton--fantasma" onClick={() => setBusqueda("")}>
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla-clases tabla-clases--moderna">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Documento</th>
                    <th>Teléfono</th>
                    <th>Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <FilaCliente key={cliente.idCliente} cliente={cliente} onCheckin={onCheckin} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}
