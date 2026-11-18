import { useEffect, useState } from "react";
import { INSTALACIONES } from "../../data/contenidoGimnasio.js";
import { EncabezadoSeccion, FotoGimnasio, IconoPublico, Revelar } from "./ElementosPublicos.jsx";

/**
 * Galeria de instalaciones. Al hacer clic en una foto se amplia en pantalla
 * completa, con flechas (o teclado) para pasar a la siguiente.
 * Solo se pueden ampliar las fotos que ya existen; las pendientes no.
 */
export default function GaleriaInstalaciones() {
  const [cargadas, setCargadas] = useState([]);
  const [indiceAbierto, setIndiceAbierto] = useState(null);

  // Fotos que si cargaron, en el mismo orden de la galeria
  const ampliables = INSTALACIONES.filter((item) => cargadas.includes(item.foto));
  const actual = indiceAbierto !== null ? ampliables[indiceAbierto] : null;

  function marcarCargada(src) {
    setCargadas((lista) => (lista.includes(src) ? lista : [...lista, src]));
  }

  function abrir(item) {
    const posicion = ampliables.findIndex((foto) => foto.foto === item.foto);
    if (posicion !== -1) setIndiceAbierto(posicion);
  }

  function mover(paso) {
    setIndiceAbierto((i) => (i + paso + ampliables.length) % ampliables.length);
  }

  // Teclado: Escape cierra, flechas cambian de foto. Evita el scroll de fondo.
  useEffect(() => {
    if (indiceAbierto === null) return undefined;
    function manejarTecla(evento) {
      if (evento.key === "Escape") setIndiceAbierto(null);
      if (evento.key === "ArrowRight") mover(1);
      if (evento.key === "ArrowLeft") mover(-1);
    }
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", manejarTecla);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", manejarTecla);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indiceAbierto, ampliables.length]);

  return (
    <section id="instalaciones" className="pub-seccion">
      <div className="pub-contenedor">
        <EncabezadoSeccion
          etiqueta="Instalaciones"
          titulo="Un espacio hecho para entrenar"
          descripcion="Máquinas, pesas y espacios para que cada sesión cuente."
        />
        <div className="pub-galeria">
          {INSTALACIONES.map((item, i) => {
            const puedeAmpliar = cargadas.includes(item.foto);
            return (
              <Revelar key={item.titulo} className={`pub-galeria__item ${i === 0 ? "pub-galeria__item--grande" : ""}`} retraso={i * 70}>
                <button
                  type="button"
                  className="pub-galeria__boton"
                  onClick={() => abrir(item)}
                  disabled={!puedeAmpliar}
                  aria-label={puedeAmpliar ? `Ampliar foto: ${item.titulo}` : item.titulo}
                >
                  <FotoGimnasio src={item.foto} alt={item.titulo} onCargada={marcarCargada} />
                  <span className="pub-galeria__titulo">
                    {item.titulo}
                    {puedeAmpliar && <IconoPublico nombre="ampliar" tamano={16} />}
                  </span>
                </button>
              </Revelar>
            );
          })}
        </div>
      </div>

      {actual && (
        <div className="pub-visor" role="dialog" aria-modal="true" aria-label={actual.titulo} onClick={() => setIndiceAbierto(null)}>
          <button type="button" className="pub-visor__cerrar" onClick={() => setIndiceAbierto(null)} aria-label="Cerrar">
            <IconoPublico nombre="cerrar" tamano={26} />
          </button>
          {ampliables.length > 1 && (
            <button
              type="button"
              className="pub-visor__flecha pub-visor__flecha--izq"
              onClick={(e) => { e.stopPropagation(); mover(-1); }}
              aria-label="Foto anterior"
            >
              <IconoPublico nombre="flechaIzq" tamano={28} />
            </button>
          )}
          <figure className="pub-visor__figura" onClick={(e) => e.stopPropagation()}>
            <img src={actual.foto} alt={actual.titulo} />
            <figcaption>{actual.titulo}</figcaption>
          </figure>
          {ampliables.length > 1 && (
            <button
              type="button"
              className="pub-visor__flecha pub-visor__flecha--der"
              onClick={(e) => { e.stopPropagation(); mover(1); }}
              aria-label="Foto siguiente"
            >
              <IconoPublico nombre="flechaDer" tamano={28} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
