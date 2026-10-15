// Iconos del menu principal dibujados en SVG (sin librerias externas).
// Todos usan "currentColor", asi toman el color del texto del boton.

function Icono({ children }) {
  return (
    <svg
      className="icono"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconoDashboard() {
  return (
    <Icono>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Icono>
  );
}

export function IconoClientes() {
  return (
    <Icono>
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
    </Icono>
  );
}

export function IconoCalendario() {
  return (
    <Icono>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </Icono>
  );
}

export function IconoPesa() {
  return (
    <Icono>
      <path d="M6 5v14M18 5v14M3 8v8M21 8v8M6 12h12" />
    </Icono>
  );
}

export function IconoTarjeta() {
  return (
    <Icono>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 15h4" />
    </Icono>
  );
}

export function IconoGrafica() {
  return (
    <Icono>
      <path d="M3 3v18h18" />
      <path d="M8 17v-5M13 17V8M18 17v-9" />
    </Icono>
  );
}

export function IconoAuriculares() {
  return (
    <Icono>
      <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
      <path d="M21 16a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z" />
      <path d="M3 16a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z" />
    </Icono>
  );
}

export function IconoAjustes() {
  return (
    <Icono>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
    </Icono>
  );
}

export function IconoSalir() {
  return (
    <Icono>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </Icono>
  );
}

export function IconoMenu() {
  return (
    <Icono>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </Icono>
  );
}
