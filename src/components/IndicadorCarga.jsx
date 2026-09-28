/**
 * Indicador de carga tematico: un disco de pesas girando, en vez de un
 * simple texto "Cargando...". Reutiliza la identidad visual de "sala de
 * pesas" del proyecto (acento naranja, mismo estilo que BadgeEstadoCupo).
 *
 * @param {{texto?: string}} props
 */
export default function IndicadorCarga({ texto = "Cargando..." }) {
  return (
    <div className="cargando" role="status">
      <svg className="cargando__disco" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#333333" strokeWidth="3" />
        <path
          d="M12 2 A10 10 0 0 1 22 12"
          stroke="#ff6a13"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span>{texto}</span>
    </div>
  );
}