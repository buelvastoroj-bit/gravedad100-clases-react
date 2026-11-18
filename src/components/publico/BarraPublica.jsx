import { useEffect, useState } from "react";
import { NAVEGACION } from "../../data/contenidoGimnasio.js";
import { IconoPublico, irASeccion } from "./ElementosPublicos.jsx";

/**
 * Barra superior fija de la pagina publica.
 * Izquierda: marca. Centro: secciones. Derecha: "Iniciar sesion" (personal)
 * e "Inscribete" (visitantes, lleva a Contacto).
 * En celular, las secciones se abren en un menu desplegable.
 */
export default function BarraPublica({ onIniciarSesion }) {
  const [conFondo, setConFondo] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  // La barra es transparente sobre el Hero y se vuelve oscura al bajar
  useEffect(() => {
    function revisarScroll() {
      setConFondo(window.scrollY > 40);
    }
    revisarScroll();
    window.addEventListener("scroll", revisarScroll, { passive: true });
    return () => window.removeEventListener("scroll", revisarScroll);
  }, []);

  // Cierra el menu de celular con la tecla Escape
  useEffect(() => {
    if (!menuAbierto) return undefined;
    function cerrarConEscape(evento) {
      if (evento.key === "Escape") setMenuAbierto(false);
    }
    window.addEventListener("keydown", cerrarConEscape);
    return () => window.removeEventListener("keydown", cerrarConEscape);
  }, [menuAbierto]);

  function navegar(id) {
    setMenuAbierto(false);
    irASeccion(id);
  }

  return (
    <header className={`pub-barra ${conFondo || menuAbierto ? "pub-barra--con-fondo" : ""}`}>
      <div className="pub-contenedor pub-barra__interior">
        <button type="button" className="pub-marca" onClick={() => navegar("inicio")} aria-label="GRAVEDAD100, ir al inicio">
          GRAVEDAD<span className="pub-marca__acento">100</span>
        </button>

        <nav className={`pub-barra__menu ${menuAbierto ? "pub-barra__menu--abierto" : ""}`} aria-label="Secciones de la página">
          {NAVEGACION.map((opcion) => (
            <button key={opcion.id} type="button" className="pub-barra__enlace" onClick={() => navegar(opcion.id)}>
              {opcion.etiqueta}
            </button>
          ))}
          <div className="pub-barra__acciones-movil">
            <button type="button" className="boton boton--fantasma" onClick={onIniciarSesion}>
              Iniciar sesión
            </button>
            <button type="button" className="boton boton--primario" onClick={() => navegar("contacto")}>
              Inscríbete
            </button>
          </div>
        </nav>

        <div className="pub-barra__acciones">
          <button type="button" className="pub-barra__login" onClick={onIniciarSesion}>
            <IconoPublico nombre="usuario" tamano={18} />
            Iniciar sesión
          </button>
          <button type="button" className="boton boton--primario pub-barra__cta" onClick={() => navegar("contacto")}>
            Inscríbete
          </button>
        </div>

        <button
          type="button"
          className="pub-barra__hamburguesa"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        >
          <IconoPublico nombre={menuAbierto ? "cerrar" : "menu"} />
        </button>
      </div>
    </header>
  );
}
