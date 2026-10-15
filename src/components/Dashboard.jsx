import BarraOcupacion from "./BarraOcupacion.jsx";
import BadgeEstadoCupo from "./BadgeEstadoCupo.jsx";
import { IconoClientes, IconoCalendario, IconoPesa, IconoTarjeta, IconoGrafica } from "./Iconos.jsx";
import {
  capitalizar, estadoCupo, clasesDeHoy, contarEntrenadores,
  proximasClases, etiquetaDia, nombreDiaHoy,
} from "../utils/formatoClases.js";

// Cantidad de clases que se muestran en "Proximas clases"
const MAX_PROXIMAS = 4;

function saludoSegunHora(ahora) {
  const hora = ahora.getHours();
  if (hora < 12) return "Buenos días";
  if (hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

/**
 * Pantalla principal despues de iniciar sesion.
 * Todos los numeros salen de la API; lo que aun no existe se marca como "Proximamente".
 */
export default function Dashboard({ clases, clientes, onVerClases }) {
  const ahora = new Date();
  const proximas = proximasClases(clases, ahora).slice(0, MAX_PROXIMAS);

  const tarjetas = [
    { etiqueta: "Clientes registrados", valor: clientes.length, detalle: "En recepción", Icono: IconoClientes },
    { etiqueta: "Clases hoy", valor: clasesDeHoy(clases, ahora).length, detalle: nombreDiaHoy(ahora), Icono: IconoCalendario },
    { etiqueta: "Entrenadores", valor: contarEntrenadores(clases), detalle: "Con clases asignadas", Icono: IconoPesa },
    { etiqueta: "Membresías activas", pronto: true, detalle: "Llega con el módulo de pagos", Icono: IconoTarjeta },
    { etiqueta: "Ingresos del mes", pronto: true, detalle: "Llega con el módulo de pagos", Icono: IconoGrafica },
  ];

  return (
    <section className="dashboard">
      <div className="encabezado-pagina">
        <h2 className="encabezado-pagina__titulo">{saludoSegunHora(ahora)} 👋</h2>
        <p className="encabezado-pagina__subtitulo">Resumen general de GRAVEDAD100</p>
      </div>

      <div className="tarjetas-resumen">
        {tarjetas.map(({ etiqueta, valor, detalle, Icono, pronto }) => (
          <article key={etiqueta} className={`tarjeta-estadistica ${pronto ? "tarjeta-estadistica--pronto" : ""}`}>
            <div className="tarjeta-estadistica__cabecera">
              <span className="tarjeta-estadistica__etiqueta">{etiqueta}</span>
              <span className="tarjeta-estadistica__icono"><Icono /></span>
            </div>
            <p className="tarjeta-estadistica__valor">{pronto ? "—" : valor}</p>
            <p className="tarjeta-estadistica__detalle">
              {pronto && <span className="tarjeta-estadistica__pronto">Próximamente</span>}
              {detalle}
            </p>
          </article>
        ))}
      </div>

      <div className="seccion-dashboard">
        <div className="seccion-dashboard__cabecera">
          <h3 className="seccion-dashboard__titulo">Próximas clases</h3>
          <button type="button" className="boton boton--fantasma boton--pequeno" onClick={onVerClases}>
            Ver todas las clases →
          </button>
        </div>

        {proximas.length === 0 ? (
          <p className="seccion-dashboard__vacio">
            No hay clases programadas.{" "}
            <button type="button" className="enlace" onClick={onVerClases}>Programar una clase</button>
          </p>
        ) : (
          <div className="lista-proximas">
            {proximas.map(({ clase, diasFaltan }) => {
              const estado = estadoCupo(clase);
              return (
                <article key={clase.idClase} className="tarjeta-clase">
                  <div className="tarjeta-clase__cabecera">
                    <h4 className="tarjeta-clase__nombre">{capitalizar(clase.nombre)}</h4>
                    <BadgeEstadoCupo clase={clase} />
                  </div>

                  <p className="tarjeta-clase__entrenador">Entrenador: {capitalizar(clase.entrenador)}</p>

                  <div className="tarjeta-clase__horario">
                    <span className={`tarjeta-clase__dia ${diasFaltan === 0 ? "tarjeta-clase__dia--hoy" : ""}`}>
                      {etiquetaDia(diasFaltan, clase.diaSemana)}
                    </span>
                    <span className="tarjeta-clase__hora">{clase.horaInicio} - {clase.horaFin}</span>
                  </div>

                  <BarraOcupacion porcentaje={estado.porcentaje} tipo={estado.tipo} />

                  <div className="tarjeta-clase__cupo">
                    <span>{clase.cupoOcupado} / {clase.cupoMaximo}</span>
                    <span>{estado.detalle}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
