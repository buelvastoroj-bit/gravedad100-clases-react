import { useState } from "react";
import FilaPlan from "./FilaPlan.jsx";
import { capitalizar, normalizarTexto } from "../utils/formatoClases.js";

// Orden en que se muestran los niveles conocidos en los filtros
const ORDEN_NIVELES = ["principiante", "intermedio", "avanzado"];

/**
 * Tabla con el listado de planes de entrenamiento personalizado (RF-03).
 * Incluye buscador por cliente u objetivo y filtro por nivel.
 *
 * @param {{
 *   planes: Array,
 *   onSolicitarEliminar: (idPlan: number) => void,
 *   onCrearNuevo: () => void
 * }} props
 */
export default function ListadoPlanes({ planes, onSolicitarEliminar, onCrearNuevo }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("todos");

  // Niveles que existen en los planes, con su cantidad
  const conteoNiveles = new Map();
  planes.forEach((plan) => {
    const clave = normalizarTexto(plan.nivel);
    if (!clave) return;
    const actual = conteoNiveles.get(clave) ?? { etiqueta: capitalizar(plan.nivel), cantidad: 0 };
    actual.cantidad += 1;
    conteoNiveles.set(clave, actual);
  });
  const niveles = [...conteoNiveles.entries()].sort((a, b) => {
    const posicionA = ORDEN_NIVELES.indexOf(a[0]);
    const posicionB = ORDEN_NIVELES.indexOf(b[0]);
    return (posicionA === -1 ? 99 : posicionA) - (posicionB === -1 ? 99 : posicionB);
  });

  const texto = normalizarTexto(busqueda);
  const planesFiltrados = planes.filter((plan) => {
    if (texto && !normalizarTexto(plan.nombreCliente).includes(texto) && !normalizarTexto(plan.objetivo).includes(texto)) {
      return false;
    }
    if (filtroNivel !== "todos" && normalizarTexto(plan.nivel) !== filtroNivel) return false;
    return true;
  });

  const hayFiltros = texto !== "" || filtroNivel !== "todos";

  function limpiarFiltros() {
    setBusqueda("");
    setFiltroNivel("todos");
  }

  return (
    <section className="listado-clases">
      <div className="encabezado-pagina encabezado-pagina--con-accion">
        <div>
          <h2 className="encabezado-pagina__titulo">Planes de entrenamiento</h2>
          <p className="encabezado-pagina__subtitulo">
            Crea planes personalizados según el objetivo y el nivel de cada cliente.
          </p>
        </div>
        <button type="button" className="boton boton--primario" onClick={onCrearNuevo}>
          + Nuevo plan
        </button>
      </div>

      {planes.length === 0 ? (
        <div className="estado-vacio">
          <p>Aún no hay planes de entrenamiento creados.</p>
          <button type="button" className="boton boton--primario" onClick={onCrearNuevo}>
            Crear el primer plan
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
                placeholder="Buscar por cliente u objetivo..."
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                aria-label="Buscar plan por cliente u objetivo"
              />
            </div>
          </div>

          <div className="filtros-estado" role="group" aria-label="Filtrar por nivel">
            <button
              type="button"
              className={`filtro-chip ${filtroNivel === "todos" ? "filtro-chip--activo" : ""}`}
              aria-pressed={filtroNivel === "todos"}
              onClick={() => setFiltroNivel("todos")}
            >
              Todos
              <span className="filtro-chip__conteo">{planes.length}</span>
            </button>
            {niveles.map(([clave, { etiqueta, cantidad }]) => (
              <button
                key={clave}
                type="button"
                className={`filtro-chip ${filtroNivel === clave ? "filtro-chip--activo" : ""}`}
                aria-pressed={filtroNivel === clave}
                onClick={() => setFiltroNivel(clave)}
              >
                {etiqueta}
                <span className="filtro-chip__conteo">{cantidad}</span>
              </button>
            ))}
          </div>

          <div className="listado-clases__resumen">
            <span className="listado-clases__contador">
              {hayFiltros
                ? `Mostrando ${planesFiltrados.length} de ${planes.length} planes`
                : `Total de planes: ${planes.length}`}
            </span>
            {hayFiltros && (
              <button type="button" className="enlace enlace--pequeno" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>

          {planesFiltrados.length === 0 ? (
            <div className="estado-vacio">
              <p>Ningún plan coincide con la búsqueda o los filtros.</p>
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
                    <th>Objetivo</th>
                    <th>Nivel</th>
                    <th>Duración</th>
                    <th>Observaciones</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {planesFiltrados.map((plan) => (
                    <FilaPlan key={plan.idPlan} plan={plan} onSolicitarEliminar={onSolicitarEliminar} />
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
