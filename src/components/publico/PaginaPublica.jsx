import { useEffect } from "react";
import BarraPublica from "./BarraPublica.jsx";
import { SeccionHero, SeccionNosotros, SeccionServicios, SeccionBeneficios } from "./SeccionesInformativas.jsx";
import GaleriaInstalaciones from "./GaleriaInstalaciones.jsx";
import { SeccionEntrenadores, SeccionClases, entrenadoresDesdeClases } from "./EquipoYClases.jsx";
import { SeccionContacto, PiePublico, BotonWhatsApp } from "./ContactoYPie.jsx";
import { irASeccion } from "./ElementosPublicos.jsx";
import "../../publico.css";

/**
 * Pagina publica de GRAVEDAD100 (la primera pantalla de la web).
 *
 * No tiene logica propia de datos: recibe desde App.jsx las MISMAS clases
 * que usa el sistema interno (hook useClases), asi que no hay datos
 * duplicados. "Iniciar sesion" lleva al login existente.
 *
 * @param {{ clases: Array, cargando: boolean, onIniciarSesion: () => void }} props
 */
export default function PaginaPublica({ clases, cargando, onIniciarSesion }) {
  // Al entrar, la pagina siempre empieza arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalEntrenadores = entrenadoresDesdeClases(clases).length;

  return (
    <div className="pub-pagina">
      <BarraPublica onIniciarSesion={onIniciarSesion} />
      <main>
        <SeccionHero totalClases={clases.length} totalEntrenadores={totalEntrenadores} />
        <SeccionNosotros />
        <SeccionServicios />
        <GaleriaInstalaciones />
        <SeccionEntrenadores clases={clases} cargando={cargando} />
        <SeccionClases clases={clases} cargando={cargando} onInscribirse={() => irASeccion("contacto")} />
        <SeccionBeneficios />
        <SeccionContacto />
      </main>
      <PiePublico onIniciarSesion={onIniciarSesion} />
      <BotonWhatsApp />
    </div>
  );
}
