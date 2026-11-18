/**
 * Contenido de la pagina publica de GRAVEDAD100.
 *
 * TODO lo que ve un visitante sale de este archivo (menos las clases y los
 * entrenadores, que salen de la API). Para cambiar un texto, un dato de
 * contacto o una foto, solo se edita aqui.
 *
 * Reglas:
 * - Los campos vacios ("") NO se muestran en la pagina. Asi no aparecen
 *   datos inventados mientras Angel no entregue los reales.
 * - Las fotos van en la carpeta public/img/. Si una foto todavia no existe,
 *   la pagina muestra un fondo con icono en su lugar (nunca una imagen rota).
 * - Los textos marcados como BORRADOR deben revisarse con Angel antes de
 *   publicar la pagina de forma oficial.
 */

export const GIMNASIO = {
  nombre: "GRAVEDAD100",
  descripcionCorta:
    "Gimnasio para entrenar con disciplina, acompañamiento y un ambiente que te impulsa a dar más.",
};

// Datos de contacto: llenar con los datos reales. Lo vacio no se muestra.
// whatsapp: solo numeros, con el indicativo del pais. Ej: "573001234567"
export const CONTACTO = {
  whatsapp: "",
  telefono: "",
  correo: "",
  direccion: "",
  ciudad: "",
  horario: "",
};

// Enlaces completos a las redes. Ej: "https://instagram.com/gravedad100"
export const REDES = {
  instagram: "",
  facebook: "",
  tiktok: "",
};

export const HERO = {
  titulo: ["Supera tus límites.", "Construye tu mejor versión."],
  descripcion:
    "En GRAVEDAD100 creemos que cada entrenamiento es una oportunidad para superar tus propios límites. Encuentra el espacio, la motivación y las herramientas para alcanzar tus objetivos.",
  foto: "/fondo-gym.jpg",
};

// BORRADOR: presentacion, mision, vision y valores deben aprobarse con Angel.
export const NOSOTROS = {
  titulo: "Más que un gimnasio, una comunidad.",
  presentacion:
    "GRAVEDAD100 es un espacio para entrenar en serio, sin importar si estás empezando o si llevas años en esto. Aquí cada persona encuentra un lugar para avanzar a su ritmo, con orientación y un ambiente que motiva.",
  mision:
    "Acompañar a cada persona en su proceso de entrenamiento con espacios adecuados, orientación cercana y un ambiente de respeto y disciplina.",
  vision:
    "Ser el gimnasio de referencia de nuestra comunidad por la constancia de sus usuarios y la calidad de su acompañamiento.",
  valores: ["Disciplina", "Respeto", "Constancia", "Compañerismo"],
  compromiso:
    "Nos comprometemos a escucharte, orientarte y mantener un espacio limpio, seguro y bien equipado para tu entrenamiento.",
};

// Fotos sugeridas: descargarlas gratis de unsplash.com o pexels.com
// (o mejor, fotos reales del gimnasio) y guardarlas con estos nombres.
export const SERVICIOS = [
  {
    nombre: "Musculación",
    descripcion: "Zona de pesas y máquinas para ganar fuerza y masa muscular con una rutina adaptada a ti.",
    foto: "/img/servicio-musculacion.jpg",
  },
  {
    nombre: "Entrenamiento personalizado",
    descripcion: "Un plan según tu objetivo y tu nivel, con seguimiento para que veas tu avance semana a semana.",
    foto: "/img/servicio-personalizado.jpg",
  },
  {
    nombre: "Spinning",
    descripcion: "Clases grupales en bicicleta con música y ritmo para mejorar tu resistencia y quemar calorías.",
    foto: "/img/servicio-spinning.jpg",
  },
  {
    nombre: "Body Pump",
    descripcion: "Trabajo con barra y discos en grupo para tonificar todo el cuerpo al ritmo de la música.",
    foto: "/img/servicio-bodypump.jpg",
  },
  {
    nombre: "Entrenamiento funcional",
    descripcion: "Ejercicios con movimientos naturales para ganar fuerza, equilibrio y agilidad en tu día a día.",
    foto: "/img/servicio-funcional.jpg",
  },
  {
    nombre: "Acondicionamiento físico",
    descripcion: "Mejora tu condición general: resistencia, movilidad y capacidad cardiovascular.",
    foto: "/img/servicio-acondicionamiento.jpg",
  },
];

export const INSTALACIONES = [
  { titulo: "Zona de máquinas y spinning", foto: "/fondo-gym.jpg" },
  { titulo: "Zona de musculación", foto: "/img/instalaciones-musculacion.jpg" },
  { titulo: "Pesas y mancuernas", foto: "/img/instalaciones-pesas.jpg" },
  { titulo: "Zona cardiovascular", foto: "/img/instalaciones-cardio.jpg" },
  { titulo: "Espacio de entrenamiento grupal", foto: "/img/instalaciones-grupal.jpg" },
];

export const BENEFICIOS = [
  { icono: "corazon", titulo: "Mejor condición física", texto: "Más energía, resistencia y salud en tu día a día." },
  { icono: "objetivo", titulo: "Entrenamiento según tu objetivo", texto: "Bajar de peso, ganar fuerza o mantenerte: tu plan se adapta a ti." },
  { icono: "equipo", titulo: "Acompañamiento", texto: "Entrenadores que te orientan para que entrenes bien y sin lesiones." },
  { icono: "niveles", titulo: "Para todos los niveles", texto: "Desde tu primer día hasta tu mejor marca, hay un lugar para ti." },
  { icono: "rayo", titulo: "Ambiente que motiva", texto: "Disciplina y buena energía para que no quieras faltar." },
];

export const NAVEGACION = [
  { id: "inicio", etiqueta: "Inicio" },
  { id: "nosotros", etiqueta: "Nosotros" },
  { id: "servicios", etiqueta: "Servicios" },
  { id: "instalaciones", etiqueta: "Instalaciones" },
  { id: "entrenadores", etiqueta: "Entrenadores" },
  { id: "clases", etiqueta: "Clases" },
  { id: "contacto", etiqueta: "Contacto" },
];
