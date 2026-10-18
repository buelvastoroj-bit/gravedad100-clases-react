import { useState } from "react";
import { useCheckins } from "../hooks/useCheckins.js";
import GraficaBarras from "./GraficaBarras.jsx";
import BarraOcupacion from "./BarraOcupacion.jsx";
import IndicadorCarga from "./IndicadorCarga.jsx";
import { IconoClientes, IconoCalendario, IconoGrafica, IconoAuriculares } from "./Iconos.jsx";
import { capitalizar, normalizarTexto } from "../utils/formatoClases.js";
import {
  PERIODOS, fechasCheckinsEnPeriodo, contarPorDiaSemana, contarPorFranja,
  clientesMasFrecuentes, ocupacionPromedio, clasesMasLlenas, clasesPorDia, registrosPorMes,
} from "../utils/reportes.js";

// Bloque con titulo para cada reporte
function Panel({ titulo, descripcion, children }) {
  return (
    <article className="panel-reporte">
      <div className="panel-reporte__cabecera">
        <h3 className="panel-reporte__titulo">{titulo}</h3>
        {descripcion && <p className="panel-reporte__descripcion">{descripcion}</p>}
      </div>
      {children}
    </article>
  );
}

/**
 * Pantalla de reportes del gimnasio.
 * Usa los datos que ya existen: clases, clientes, solicitudes y check-ins.
 */
export default function Reportes({ clases, clientes, solicitudes }) {
  const { checkins, cargando, error, recargar } = useCheckins();
  const [periodo, setPeriodo] = useState("todo");

  if (cargando) {
    return <IndicadorCarga texto="Calculando reportes..." />;
  }

  const periodoActual = PERIODOS.find((p) => p.valor === periodo) ?? PERIODOS[2];
  const registros = fechasCheckinsEnPeriodo(checkins, periodoActual.dias);
  const clientesQueAsistieron = new Set(registros.map((r) => r.idCliente)).size;
  const ocupacion = ocupacionPromedio(clases);

  const pendientes = solicitudes.filter((s) => normalizarTexto(s.estado) === "pendiente").length;
  const resueltas = solicitudes.length - pendientes;
  const porcentajeResueltas = solicitudes.length > 0 ? Math.round((resueltas / solicitudes.length) * 100) : 0;

  const frecuentes = clientesMasFrecuentes(registros, clientes);
  const masLlenas = clasesMasLlenas(clases);

  const tarjetas = [
    { etiqueta: "Check-ins", valor: registros.length, detalle: periodoActual.etiqueta, Icono: IconoGrafica },
    {
      etiqueta: "Clientes que asistieron",
      valor: clientesQueAsistieron,
      detalle: `De ${clientes.length} registrados`,
      Icono: IconoClientes,
    },
    {
      etiqueta: "Ocupación de clases",
      valor: ocupacion === null ? "—" : `${ocupacion}%`,
      detalle: "Promedio de todas las clases",
      Icono: IconoCalendario,
    },
    {
      etiqueta: "Solicitudes resueltas",
      valor: `${resueltas}/${solicitudes.length}`,
      detalle: solicitudes.length > 0 ? `${porcentajeResueltas}% atendidas` : "Sin solicitudes",
      Icono: IconoAuriculares,
    },
  ];

  return (
    <section className="reportes">
      <div className="encabezado-pagina encabezado-pagina--con-accion">
        <div>
          <h2 className="encabezado-pagina__titulo">Reportes</h2>
          <p className="encabezado-pagina__subtitulo">
            Indicadores del gimnasio calculados con los datos registrados en el sistema.
          </p>
        </div>
        <button type="button" className="boton boton--fantasma" onClick={recargar}>
          Actualizar datos
        </button>
      </div>

      {error && (
        <div className="alerta alerta--error">
          No se pudo cargar la asistencia: {error}{" "}
          <button type="button" className="enlace" onClick={recargar}>Reintentar</button>
        </div>
      )}

      <div className="filtros-estado reportes__periodo" role="group" aria-label="Periodo de asistencia">
        <span className="reportes__periodo-texto">Asistencia:</span>
        {PERIODOS.map((opcion) => (
          <button
            key={opcion.valor}
            type="button"
            className={`filtro-chip ${periodo === opcion.valor ? "filtro-chip--activo" : ""}`}
            aria-pressed={periodo === opcion.valor}
            onClick={() => setPeriodo(opcion.valor)}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>

      <div className="tarjetas-resumen">
        {tarjetas.map(({ etiqueta, valor, detalle, Icono }) => (
          <article key={etiqueta} className="tarjeta-estadistica">
            <div className="tarjeta-estadistica__cabecera">
              <span className="tarjeta-estadistica__etiqueta">{etiqueta}</span>
              <span className="tarjeta-estadistica__icono"><Icono /></span>
            </div>
            <p className="tarjeta-estadistica__valor">{valor}</p>
            <p className="tarjeta-estadistica__detalle">{detalle}</p>
          </article>
        ))}
      </div>

      <h3 className="reportes__seccion">Asistencia</h3>
      <div className="reportes-grid">
        <Panel titulo="Check-ins por día de la semana" descripcion={periodoActual.etiqueta}>
          <GraficaBarras datos={contarPorDiaSemana(registros)} textoVacio="No hay check-ins en este periodo." />
        </Panel>

        <Panel titulo="Check-ins por horario" descripcion="Hora de ingreso al gimnasio">
          <GraficaBarras datos={contarPorFranja(registros)} textoVacio="No hay check-ins en este periodo." />
        </Panel>

        <Panel titulo="Clientes más frecuentes" descripcion={periodoActual.etiqueta}>
          {frecuentes.length === 0 ? (
            <p className="grafica-vacia">No hay check-ins en este periodo.</p>
          ) : (
            <ol className="ranking">
              {frecuentes.map((cliente, posicion) => (
                <li key={cliente.idCliente} className="ranking__fila">
                  <span className="ranking__posicion">{posicion + 1}</span>
                  <span className="ranking__nombre">{cliente.nombre}</span>
                  <span className="ranking__valor">
                    {cliente.visitas} {cliente.visitas === 1 ? "visita" : "visitas"}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <h3 className="reportes__seccion">Clases y clientes</h3>
      <div className="reportes-grid">
        <Panel titulo="Clases con mayor ocupación" descripcion="Inscritos frente al cupo máximo">
          {masLlenas.length === 0 ? (
            <p className="grafica-vacia">No hay clases programadas.</p>
          ) : (
            <ul className="ranking">
              {masLlenas.map(({ clase, estado }) => (
                <li key={clase.idClase} className="ranking__fila ranking__fila--con-barra">
                  <div className="ranking__detalle">
                    <span className="ranking__nombre">
                      {capitalizar(clase.nombre)}
                      <span className="ranking__extra"> · {capitalizar(clase.entrenador)}</span>
                    </span>
                    <span className="ranking__valor">{estado.porcentaje}%</span>
                  </div>
                  <BarraOcupacion porcentaje={estado.porcentaje} tipo={estado.tipo} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel titulo="Clases programadas por día" descripcion="Distribución de la semana">
          <GraficaBarras datos={clasesPorDia(clases)} textoVacio="No hay clases programadas." />
        </Panel>

        <Panel titulo="Nuevos clientes por mes" descripcion="Últimos 6 meses">
          <GraficaBarras datos={registrosPorMes(clientes)} textoVacio="No hay registros en los últimos meses." />
        </Panel>
      </div>

      <h3 className="reportes__seccion">Atención al cliente</h3>
      <div className="reportes-grid">
        <Panel titulo="Estado de las solicitudes" descripcion={`${solicitudes.length} solicitudes en total`}>
          {solicitudes.length === 0 ? (
            <p className="grafica-vacia">Aún no hay solicitudes registradas.</p>
          ) : (
            <>
              <div className="barra-dividida" role="img" aria-label={`${resueltas} resueltas y ${pendientes} pendientes`}>
                <div className="barra-dividida__parte barra-dividida__parte--resuelta" style={{ width: `${porcentajeResueltas}%` }} />
                <div className="barra-dividida__parte barra-dividida__parte--pendiente" style={{ width: `${100 - porcentajeResueltas}%` }} />
              </div>
              <div className="leyenda">
                <span className="leyenda__item">
                  <span className="leyenda__punto leyenda__punto--resuelta" /> Resueltas: {resueltas}
                </span>
                <span className="leyenda__item">
                  <span className="leyenda__punto leyenda__punto--pendiente" /> Pendientes: {pendientes}
                </span>
              </div>
            </>
          )}
        </Panel>
      </div>
    </section>
  );
}
