import { useState } from "react";
import FilaSolicitud from "./FilaSolicitud.jsx";
import { normalizarTexto } from "../utils/formatoClases.js";

function esPendiente(solicitud) {
  return normalizarTexto(solicitud.estado) === "pendiente";
}

const FILTROS = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "pendientes", etiqueta: "Pendientes" },
  { valor: "resueltas", etiqueta: "Resueltas" },
];

/**
 * Tabla con el listado de solicitudes de atencion al cliente (RF-04).
 * Las pendientes se muestran primero para que no se queden sin respuesta.
 * Incluye buscador por cliente o asunto y filtro por estado.
 *
 * @param {{
 *   solicitudes: Array,
 *   onResolver: (solicitud: Object) => void,
 *   onRegistrarNueva: () => void
 * }} props
 */
export default function ListadoSolicitudes({ solicitudes, onResolver, onRegistrarNueva }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todas");

  const pendientes = solicitudes.filter(esPendiente).length;
  const conteo = {
    todas: solicitudes.length,
    pendientes,
    resueltas: solicitudes.length - pendientes,
  };

  const texto = normalizarTexto(busqueda);
  const solicitudesFiltradas = solicitudes
    .filter((solicitud) => {
      if (
        texto &&
        !normalizarTexto(solicitud.nombreCliente).includes(texto) &&
        !normalizarTexto(solicitud.asunto).includes(texto)
      ) {
        return false;
      }
      if (filtro === "pendientes" && !esPendiente(solicitud)) return false;
      if (filtro === "resueltas" && esPendiente(solicitud)) return false;
      return true;
    })
    // Pendientes primero; dentro de cada grupo se respeta el orden original
    .sort((a, b) => Number(esPendiente(b)) - Number(esPendiente(a)));

  const hayFiltros = texto !== "" || filtro !== "todas";

  function limpiarFiltros() {
    setBusqueda("");
    setFiltro("todas");
  }

  return (
    <section className="listado-clases">
      <div className="encabezado-pagina encabezado-pagina--con-accion">
        <div>
          <h2 className="encabezado-pagina__titulo">Solicitudes de atención</h2>
          <p className="encabezado-pagina__subtitulo">
            Registra las peticiones, quejas y sugerencias de los clientes y dales respuesta.
          </p>
        </div>
        <button type="button" className="boton boton--primario" onClick={onRegistrarNueva}>
          + Nueva solicitud
        </button>
      </div>

      {solicitudes.length === 0 ? (
        <div className="estado-vacio">
          <p>Aún no hay solicitudes registradas.</p>
          <button type="button" className="boton boton--primario" onClick={onRegistrarNueva}>
            Registrar la primera solicitud
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
                placeholder="Buscar por cliente o asunto..."
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                aria-label="Buscar solicitud por cliente o asunto"
              />
            </div>
          </div>

          <div className="filtros-estado" role="group" aria-label="Filtrar por estado">
            {FILTROS.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                className={`filtro-chip ${filtro === opcion.valor ? "filtro-chip--activo" : ""}`}
                aria-pressed={filtro === opcion.valor}
                onClick={() => setFiltro(opcion.valor)}
              >
                {opcion.etiqueta}
                <span className="filtro-chip__conteo">{conteo[opcion.valor]}</span>
              </button>
            ))}
          </div>

          <div className="listado-clases__resumen">
            <span className="listado-clases__contador">
              {hayFiltros
                ? `Mostrando ${solicitudesFiltradas.length} de ${solicitudes.length} solicitudes`
                : `Total: ${solicitudes.length} · Pendientes: ${pendientes}`}
            </span>
            {hayFiltros && (
              <button type="button" className="enlace enlace--pequeno" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>

          {solicitudesFiltradas.length === 0 ? (
            <div className="estado-vacio">
              <p>Ninguna solicitud coincide con la búsqueda o los filtros.</p>
              <button type="button" className="boton boton--fantasma" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla-clases tabla-clases--moderna">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Solicitud</th>
                    <th>Estado</th>
                    <th>Respuesta</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesFiltradas.map((solicitud) => (
                    <FilaSolicitud key={solicitud.idSolicitud} solicitud={solicitud} onResolver={onResolver} />
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
