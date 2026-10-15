/**
 * Ilustracion decorativa de una barra de pesas cargada (barbell), para
 * dar identidad visual fuerte a la pantalla de acceso (login/registro).
 */
export default function IlustracionPesas() {
  return (
    <svg
      className="ilustracion-pesas"
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Barra central */}
      <rect x="60" y="94" width="280" height="12" rx="3" fill="#4a4a4a" />

      {/* --- Discos lado izquierdo (grande a pequeño) --- */}
      <rect x="40" y="40" width="26" height="120" rx="6" fill="#ff6a13" />
      <rect x="68" y="55" width="18" height="90" rx="5" fill="#cc5510" />
      <rect x="88" y="70" width="12" height="60" rx="4" fill="#4a4a4a" />

      {/* --- Discos lado derecho (grande a pequeño) --- */}
      <rect x="334" y="40" width="26" height="120" rx="6" fill="#ff6a13" />
      <rect x="314" y="55" width="18" height="90" rx="5" fill="#cc5510" />
      <rect x="300" y="70" width="12" height="60" rx="4" fill="#4a4a4a" />

      {/* Agarres de la barra (texturizado central) */}
      <rect x="160" y="98" width="80" height="4" rx="2" fill="#2a2a2a" />
      <rect x="160" y="106" width="80" height="4" rx="2" fill="#2a2a2a" />
    </svg>
  );
}