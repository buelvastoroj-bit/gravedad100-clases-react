import { HERO, NOSOTROS, SERVICIOS, BENEFICIOS } from "../../data/contenidoGimnasio.js";
import { EncabezadoSeccion, FotoGimnasio, IconoPublico, Revelar, irASeccion } from "./ElementosPublicos.jsx";

/**
 * Secciones de contenido fijo de la pagina publica: Hero, Nosotros,
 * Servicios y Beneficios. Los textos salen de contenidoGimnasio.js.
 */

/** Portada con la foto real del gimnasio. Los numeros salen de la API (nada inventado). */
export function SeccionHero({ totalClases, totalEntrenadores }) {
  return (
    <section id="inicio" className="pub-hero" style={{ backgroundImage: `url("${HERO.foto}")` }}>
      <div className="pub-hero__capa" aria-hidden="true" />
      <div className="pub-contenedor pub-hero__contenido">
        <span className="pub-hero__etiqueta">Gimnasio · Entrenamiento · Comunidad</span>
        <h1 className="pub-hero__titulo">
          <span>{HERO.titulo[0]}</span>
          <span className="pub-hero__titulo-acento">{HERO.titulo[1]}</span>
        </h1>
        <p className="pub-hero__descripcion">{HERO.descripcion}</p>
        <div className="pub-hero__botones">
          <button type="button" className="boton boton--primario pub-boton-grande" onClick={() => irASeccion("servicios")}>
            Conoce nuestros servicios
          </button>
          <button type="button" className="boton boton--fantasma pub-boton-grande pub-boton-claro" onClick={() => irASeccion("contacto")}>
            Inscríbete ahora
          </button>
        </div>

        {(totalClases > 0 || totalEntrenadores > 0) && (
          <dl className="pub-hero__datos">
            {totalClases > 0 && (
              <div>
                <dt>Clases a la semana</dt>
                <dd>{totalClases}</dd>
              </div>
            )}
            {totalEntrenadores > 0 && (
              <div>
                <dt>Entrenadores</dt>
                <dd>{totalEntrenadores}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
      <button type="button" className="pub-hero__bajar" onClick={() => irASeccion("nosotros")} aria-label="Bajar a Nosotros">
        <span />
      </button>
    </section>
  );
}

export function SeccionNosotros() {
  const bloques = [
    { titulo: "Misión", texto: NOSOTROS.mision },
    { titulo: "Visión", texto: NOSOTROS.vision },
    { titulo: "Nuestro compromiso", texto: NOSOTROS.compromiso },
  ].filter((bloque) => bloque.texto);

  return (
    <section id="nosotros" className="pub-seccion">
      <div className="pub-contenedor pub-nosotros">
        <div>
          <EncabezadoSeccion etiqueta="Nosotros" titulo={NOSOTROS.titulo} descripcion={NOSOTROS.presentacion} />
          {NOSOTROS.valores.length > 0 && (
            <Revelar className="pub-valores" retraso={120}>
              {NOSOTROS.valores.map((valor) => (
                <span key={valor} className="pub-valores__item">{valor}</span>
              ))}
            </Revelar>
          )}
        </div>
        <div className="pub-nosotros__bloques">
          {bloques.map((bloque, i) => (
            <Revelar key={bloque.titulo} className="pub-tarjeta pub-nosotros__bloque" retraso={i * 100}>
              <span className="pub-nosotros__numero">0{i + 1}</span>
              <h3>{bloque.titulo}</h3>
              <p>{bloque.texto}</p>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SeccionServicios() {
  return (
    <section id="servicios" className="pub-seccion pub-seccion--alterna">
      <div className="pub-contenedor">
        <EncabezadoSeccion
          etiqueta="Servicios"
          titulo="Entrena a tu manera"
          descripcion="Elige cómo quieres entrenar. Te orientamos para que encuentres lo que mejor va contigo."
          centrado
        />
        <div className="pub-servicios">
          {SERVICIOS.map((servicio, i) => (
            <Revelar key={servicio.nombre} como="article" className="pub-servicio" retraso={(i % 3) * 90}>
              <div className="pub-servicio__foto">
                <FotoGimnasio src={servicio.foto} alt={servicio.nombre} />
              </div>
              <div className="pub-servicio__texto">
                <h3>{servicio.nombre}</h3>
                <p>{servicio.descripcion}</p>
              </div>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SeccionBeneficios() {
  return (
    <section className="pub-seccion pub-beneficios-fondo">
      <div className="pub-contenedor">
        <EncabezadoSeccion etiqueta="Beneficios" titulo="¿Por qué entrenar en GRAVEDAD100?" centrado />
        <div className="pub-beneficios">
          {BENEFICIOS.map((beneficio, i) => (
            <Revelar key={beneficio.titulo} className="pub-beneficio" retraso={i * 80}>
              <span className="pub-beneficio__icono"><IconoPublico nombre={beneficio.icono} tamano={26} /></span>
              <h3>{beneficio.titulo}</h3>
              <p>{beneficio.texto}</p>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
