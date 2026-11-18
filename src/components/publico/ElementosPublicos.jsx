import { useEffect, useRef, useState } from "react";

/**
 * Piezas pequenas que reutilizan todas las secciones de la pagina publica.
 */

/**
 * Foto que nunca se ve rota: si el archivo todavia no existe en public/img,
 * muestra un fondo oscuro con un icono y el nombre de lo que falta.
 */
export function FotoGimnasio({ src, alt, className = "", onCargada }) {
  const [fallo, setFallo] = useState(!src);

  if (fallo) {
    return (
      <div className={`pub-foto pub-foto--pendiente ${className}`} role="img" aria-label={alt}>
        <IconoPublico nombre="camara" />
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      className={`pub-foto ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFallo(true)}
      onLoad={() => onCargada?.(src)}
    />
  );
}

/**
 * Hace aparecer suavemente su contenido cuando entra en pantalla.
 * Si el navegador no soporta IntersectionObserver, se muestra de una vez.
 */
export function Revelar({ children, className = "", retraso = 0, como: Etiqueta = "div" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta
      ref={ref}
      className={`pub-revelar ${visible ? "pub-revelar--visible" : ""} ${className}`}
      style={retraso ? { transitionDelay: `${retraso}ms` } : undefined}
    >
      {children}
    </Etiqueta>
  );
}

/** Titulo de seccion con una etiqueta pequena arriba (ej: "SERVICIOS"). */
export function EncabezadoSeccion({ etiqueta, titulo, descripcion, centrado = false }) {
  return (
    <Revelar className={`pub-encabezado ${centrado ? "pub-encabezado--centrado" : ""}`}>
      <span className="pub-encabezado__etiqueta">{etiqueta}</span>
      <h2 className="pub-encabezado__titulo">{titulo}</h2>
      {descripcion && <p className="pub-encabezado__descripcion">{descripcion}</p>}
    </Revelar>
  );
}

/** Lleva la pagina hasta una seccion con desplazamiento suave. */
export function irASeccion(id) {
  const seccion = document.getElementById(id);
  if (!seccion) return;
  const reducirMovimiento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  seccion.scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "start" });
}

const RUTAS_ICONOS = {
  camara: (
    <>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </>
  ),
  corazon: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
  objetivo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  equipo: (
    <>
      <circle cx="9" cy="7" r="4" />
      <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75M21 21v-2a4 4 0 0 0-3-3.85" />
    </>
  ),
  niveles: <path d="M3 21h4v-6H3zM10 21h4V9h-4zM17 21h4V3h-4z" />,
  rayo: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  pesa: <path d="M6 5v14M18 5v14M3 8v8M21 8v8M6 12h12" />,
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
  ubicacion: (
    <>
      <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  telefono: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  correo: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </>
  ),
  whatsapp: (
    <path d="M3 21l1.65-4.65A8.5 8.5 0 1 1 8 19.7L3 21z M9 9.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2L9 9.5z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  tiktok: <path d="M16 3c.5 2.5 2 4 5 4v4c-2 0-3.6-.6-5-1.6V16a6 6 0 1 1-6-6v4a2 2 0 1 0 2 2V3z" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  cerrar: <path d="M18 6 6 18M6 6l12 12" />,
  flechaIzq: <path d="m15 18-6-6 6-6" />,
  flechaDer: <path d="m9 18 6-6-6-6" />,
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </>
  ),
  ampliar: <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />,
};

/** Iconos SVG de la pagina publica (sin librerias externas). */
export function IconoPublico({ nombre, tamano = 22 }) {
  return (
    <svg
      className="pub-icono"
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {RUTAS_ICONOS[nombre]}
    </svg>
  );
}
