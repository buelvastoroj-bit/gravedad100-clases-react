import { estadoCupo } from "../utils/formatoClases.js";

/**
 * Etiqueta visual del estado del cupo de una clase (HU-05).
 * Tres estados: Con cupo (verde), Ultimos cupos (amarillo) y Completo (rojo).
 *
 * @param {{clase: import('../data/ClaseGrupal.js').ClaseGrupal}} props
 */
export default function BadgeEstadoCupo({ clase }) {
  const estado = estadoCupo(clase);

  return (
    <span className={`badge-cupo badge-cupo--${estado.tipo}`}>
      <span className="badge-cupo__disco" aria-hidden="true" />
      {estado.texto}
    </span>
  );
}
