import { tieneCupoDisponible } from "../data/ClaseGrupal.js";

/**
 * Etiqueta visual que indica si una clase tiene cupo disponible o esta
 * llena. Equivalente visual del atributo "Estado" del listado.jsp del
 * backend (HU-05).
 *
 * @param {{clase: import('../data/ClaseGrupal.js').ClaseGrupal}} props
 */
export default function BadgeEstadoCupo({ clase }) {
  const disponible = tieneCupoDisponible(clase);

  return (
    <span className={`badge-cupo ${disponible ? "badge-cupo--disponible" : "badge-cupo--lleno"}`}>
      <span className="badge-cupo__disco" aria-hidden="true" />
      {disponible ? "Con cupo" : "Lleno"}
    </span>
  );
}
