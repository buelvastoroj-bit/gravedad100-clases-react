import { useState } from "react";
import FilaClase from "./FilaClase.jsx";
import {
  capitalizar, estadoCupo, normalizarTexto, indiceDia, nombreDia, ordenSemana,
} from "../utils/formatoClases.js";

const FILTROS_ESTADO = [
  { valor: "todos", etiqueta: "Todos" },
  { valor: "disponible", etiqueta: "Con cupo" },
  { valor: "pocos", etiqueta: "Últimos cupos" },
  { valor: "lleno", etiqueta: "Completo" },
];

/**
 * Tabla con el listado completo de clases programadas (HU-01).
 * Incluye buscador y filtros por estado, entrenador y dia.
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
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroEntrenador, setFiltroEntrenador] = useState("");
  const [filtroDia, setFiltroDia] = useState("");

  // Opciones de los filtros, sacadas de las clases que existen
  const entrenadores = [
    ...new Map(clases.map((clase) => [normalizarTexto(clase.entrenador), capitalizar(clase.entrenador)])),
  ]
    .filter(([clave]) => clave)
    .sort((a, b) => a[1].localeCompare(b[1]));

  const dias = [...new Set(clases.map((clase) => indiceDia(clase.diaSemana)).filter((i) => i !== -1))]
    .sort((a, b) => ordenSemana(a) - ordenSemana(b));

  // Cuantas clases hay en cada estado (se muestra en los botones de filtro)
  const conteo = { todos: clases.length, disponible: 0, pocos: 0, lleno: 0 };
  clases.forEach((clase) => { conteo[estadoCupo(clase).tipo] += 1; });

  const texto = normalizarTexto(busqueda);
  const clasesFiltradas = clases.filter((clase) => {
    if (texto && !normalizarTexto(clase.nombre).includes(texto) && !normalizarTexto(clase.entrenador).includes(texto)) {
      return false;
    }
    if (filtroEstado !== "todos" && estadoCupo(clase).tipo !== filtroEstado) return false;
    if (filtroEntrenador && normalizarTexto(clase.entrenador) !== filtroEntrenador) return false;
    if (filtroDia !== "" && indiceDia(clase.diaSemana) !== Number(filtroDia)) return false;
    return true;
  });

  const hayFiltros = texto !== "" || filtroEstado !== "todos" || filtroEntrenador !== "" || filtroDia !== "";

  function limpiarFiltros() {
    setBusqueda("");
    setFiltroEstado("todos");
    setFiltroEntrenador("");
    setFiltroDia("");
  }

  return (
    <section className="listado-clases">
      <div className="encabezado-pagina encabezado-pagina--con-accion">
        <div>
          <h2 className="encabezado-pagina__titulo">Clases programadas</h2>
          <p className="encabezado-pagina__subtitulo">
            Administra los horarios, entrenadores y cupos disponibles.
          </p>
        </div>
        <button type="button" className="boton boton--primario" onClick={onProgramarNueva}>
          + Programar nueva clase
        </button>
      </div>

      {clases.length === 0 ? (
        <div className="estado-vacio">
          <p>Aún no hay clases programadas.</p>
          <button type="button" className="boton boton--primario" onClick={onProgramarNueva}>
            Programar la primera clase
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
                placeholder="Buscar clase o entrenador..."
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                aria-label="Buscar clase o entrenador"
              />
            </div>

            <select
              className="filtro-select"
              value={filtroEntrenador}
              onChange={(evento) => setFiltroEntrenador(evento.target.value)}
              aria-label="Filtrar por entrenador"
            >
              <option value="">Todos los entrenadores</option>
              {entrenadores.map(([clave, nombre]) => (
                <option key={clave} value={clave}>{nombre}</option>
              ))}
            </select>

            <select
              className="filtro-select"
              value={filtroDia}
              onChange={(evento) => setFiltroDia(evento.target.value)}
              aria-label="Filtrar por día"
            >
              <option value="">Todos los días</option>
              {dias.map((indice) => (
                <option key={indice} value={indice}>{nombreDia(indice)}</option>
              ))}
            </select>
          </div>

          <div className="filtros-estado" role="group" aria-label="Filtrar por estado del cupo">
            {FILTROS_ESTADO.map((filtro) => (
              <button
                key={filtro.valor}
                type="button"
                className={`filtro-chip filtro-chip--${filtro.valor} ${filtroEstado === filtro.valor ? "filtro-chip--activo" : ""}`}
                aria-pressed={filtroEstado === filtro.valor}
                onClick={() => setFiltroEstado(filtro.valor)}
              >
                {filtro.etiqueta}
                <span className="filtro-chip__conteo">{conteo[filtro.valor]}</span>
              </button>
            ))}
          </div>

          <div className="listado-clases__resumen">
            <span className="listado-clases__contador">
              {hayFiltros
                ? `Mostrando ${clasesFiltradas.length} de ${clases.length} clases`
                : `Total de clases: ${clases.length}`}
            </span>
            {hayFiltros && (
              <button type="button" className="enlace enlace--pequeno" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            )}
          </div>

          {clasesFiltradas.length === 0 ? (
            <div className="estado-vacio">
              <p>Ninguna clase coincide con la búsqueda o los filtros.</p>
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
                    <th>Nombre</th>
                    <th>Entrenador</th>
                    <th>Día</th>
                    <th>Horario</th>
                    <th>Cupo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clasesFiltradas.map((clase) => (
                    <FilaClase
                      key={clase.idClase}
                      clase={clase}
                      onEditar={onEditar}
                      onSolicitarEliminar={onSolicitarEliminar}
                    />
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
