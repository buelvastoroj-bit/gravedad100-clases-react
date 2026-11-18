import { useState } from "react";
import { CONTACTO, REDES, GIMNASIO, NAVEGACION, SERVICIOS } from "../../data/contenidoGimnasio.js";
import { EncabezadoSeccion, IconoPublico, Revelar, irASeccion } from "./ElementosPublicos.jsx";

/**
 * Contacto, pie de pagina, aviso de privacidad y boton flotante de WhatsApp.
 * El formulario NO guarda datos en ningun servidor: abre WhatsApp con el
 * mensaje ya escrito, para que el visitante lo envie el mismo.
 * Los datos de contacto vacios en contenidoGimnasio.js no se muestran.
 */

const INTERESES = ["Inscribirme", "Clases grupales", "Entrenamiento personalizado", "Otra consulta"];

function enlaceWhatsApp(texto = "") {
  if (!CONTACTO.whatsapp) return "";
  const numero = CONTACTO.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${numero}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}

/** Lista de datos de contacto que si estan configurados. */
function datosContacto() {
  const direccion = [CONTACTO.direccion, CONTACTO.ciudad].filter(Boolean).join(", ");
  return [
    CONTACTO.whatsapp && { icono: "whatsapp", etiqueta: "WhatsApp", valor: `+${CONTACTO.whatsapp}`, enlace: enlaceWhatsApp() },
    CONTACTO.telefono && { icono: "telefono", etiqueta: "Teléfono", valor: CONTACTO.telefono, enlace: `tel:${CONTACTO.telefono.replace(/\s/g, "")}` },
    CONTACTO.correo && { icono: "correo", etiqueta: "Correo", valor: CONTACTO.correo, enlace: `mailto:${CONTACTO.correo}` },
    direccion && { icono: "ubicacion", etiqueta: "Dirección", valor: direccion },
    CONTACTO.horario && { icono: "reloj", etiqueta: "Horario", valor: CONTACTO.horario },
  ].filter(Boolean);
}

function redesConfiguradas() {
  return [
    REDES.instagram && { icono: "instagram", nombre: "Instagram", enlace: REDES.instagram },
    REDES.facebook && { icono: "facebook", nombre: "Facebook", enlace: REDES.facebook },
    REDES.tiktok && { icono: "tiktok", nombre: "TikTok", enlace: REDES.tiktok },
  ].filter(Boolean);
}

function Redes() {
  const redes = redesConfiguradas();
  if (redes.length === 0) return null;
  return (
    <div className="pub-redes">
      {redes.map((red) => (
        <a key={red.nombre} href={red.enlace} target="_blank" rel="noopener noreferrer" aria-label={red.nombre}>
          <IconoPublico nombre={red.icono} tamano={20} />
        </a>
      ))}
    </div>
  );
}

export function SeccionContacto() {
  const [valores, setValores] = useState({ nombre: "", telefono: "", interes: INTERESES[0], mensaje: "" });
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);
  const datos = datosContacto();

  function cambiar(evento) {
    const { name, value } = evento.target;
    setValores((actuales) => ({ ...actuales, [name]: value }));
    setAviso(null);
  }

  function enviar(evento) {
    evento.preventDefault();
    const nuevos = {};
    if (valores.nombre.trim().length < 3) nuevos.nombre = "Escribe tu nombre (mínimo 3 letras).";
    const digitos = valores.telefono.replace(/\D/g, "");
    if (digitos.length < 7 || digitos.length > 15) nuevos.telefono = "Escribe un número de celular válido.";
    if (valores.mensaje.trim().length < 10) nuevos.mensaje = "Cuéntanos un poco más (mínimo 10 caracteres).";
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    if (!CONTACTO.whatsapp) {
      setAviso({
        tipo: "error",
        texto: "Por ahora no podemos recibir mensajes por aquí. Acércate al gimnasio y con gusto te atendemos.",
      });
      return;
    }

    const texto =
      `Hola GRAVEDAD100, soy ${valores.nombre.trim()}.\n` +
      `Me interesa: ${valores.interes}.\n` +
      `${valores.mensaje.trim()}\n` +
      `Mi número: ${valores.telefono.trim()}`;
    window.open(enlaceWhatsApp(texto), "_blank", "noopener,noreferrer");
    setAviso({ tipo: "exito", texto: "Abrimos WhatsApp con tu mensaje listo. Solo falta que lo envíes." });
  }

  return (
    <section id="contacto" className="pub-seccion pub-seccion--alterna">
      <div className="pub-contenedor pub-contacto">
        <div>
          <EncabezadoSeccion
            etiqueta="Contacto"
            titulo="Empieza hoy"
            descripcion="Déjanos tus datos y te ayudamos con tu inscripción, horarios o cualquier duda."
          />
          {datos.length > 0 ? (
            <ul className="pub-contacto__datos">
              {datos.map((dato) => (
                <li key={dato.etiqueta}>
                  <span className="pub-contacto__icono"><IconoPublico nombre={dato.icono} tamano={20} /></span>
                  <div>
                    <span className="pub-contacto__etiqueta">{dato.etiqueta}</span>
                    {dato.enlace ? (
                      <a href={dato.enlace} target={dato.icono === "whatsapp" ? "_blank" : undefined} rel="noopener noreferrer">{dato.valor}</a>
                    ) : (
                      <span>{dato.valor}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pub-aviso">Muy pronto publicaremos nuestros datos de contacto. Mientras tanto, visítanos en el gimnasio.</p>
          )}
          <Redes />
        </div>

        <Revelar retraso={100}>
          <form className="pub-tarjeta pub-formulario" onSubmit={enviar} noValidate>
            {aviso && <div className={`alerta alerta--${aviso.tipo}`}>{aviso.texto}</div>}

            <div className="campo">
              <label htmlFor="contacto-nombre">Nombre completo</label>
              <input id="contacto-nombre" name="nombre" type="text" autoComplete="name" value={valores.nombre} onChange={cambiar}
                aria-invalid={Boolean(errores.nombre)} />
              {errores.nombre && <p className="campo__error">{errores.nombre}</p>}
            </div>

            <div className="pub-formulario__fila">
              <div className="campo">
                <label htmlFor="contacto-telefono">Celular</label>
                <input id="contacto-telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" value={valores.telefono}
                  onChange={cambiar} aria-invalid={Boolean(errores.telefono)} />
                {errores.telefono && <p className="campo__error">{errores.telefono}</p>}
              </div>
              <div className="campo">
                <label htmlFor="contacto-interes">Me interesa</label>
                <select id="contacto-interes" name="interes" value={valores.interes} onChange={cambiar}>
                  {INTERESES.map((opcion) => <option key={opcion}>{opcion}</option>)}
                </select>
              </div>
            </div>

            <div className="campo">
              <label htmlFor="contacto-mensaje">Mensaje</label>
              <textarea id="contacto-mensaje" name="mensaje" rows="4" placeholder="Cuéntanos tu objetivo o tu pregunta."
                value={valores.mensaje} onChange={cambiar} aria-invalid={Boolean(errores.mensaje)} />
              {errores.mensaje && <p className="campo__error">{errores.mensaje}</p>}
            </div>

            <button type="submit" className="boton boton--primario pub-formulario__enviar">
              <IconoPublico nombre="whatsapp" tamano={18} />
              Enviar por WhatsApp
            </button>
            <p className="pub-formulario__nota">Tus datos no se guardan en este sitio: se envían solo por WhatsApp.</p>
          </form>
        </Revelar>
      </div>
    </section>
  );
}

function AvisoPrivacidad({ onCerrar }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-privacidad" onClick={onCerrar}>
      <div className="modal-caja pub-privacidad" onClick={(e) => e.stopPropagation()}>
        <h2 id="titulo-privacidad" className="modal-caja__titulo">Aviso de privacidad</h2>
        <p className="modal-caja__mensaje">
          Esta página no guarda los datos que escribes en el formulario de contacto: solo los usa para
          preparar un mensaje de WhatsApp que tú decides si envías.
        </p>
        <p className="modal-caja__mensaje">
          Los datos de los clientes inscritos se registran en el gimnasio y los usa únicamente el personal
          autorizado para la gestión de sus servicios.
        </p>
        <div className="modal-caja__acciones">
          <button type="button" className="boton boton--primario" onClick={onCerrar}>Entendido</button>
        </div>
      </div>
    </div>
  );
}

export function PiePublico({ onIniciarSesion }) {
  const [verPrivacidad, setVerPrivacidad] = useState(false);
  const datos = datosContacto();

  return (
    <footer className="pub-pie">
      <div className="pub-contenedor pub-pie__columnas">
        <div>
          <span className="pub-marca pub-marca--pie">GRAVEDAD<span className="pub-marca__acento">100</span></span>
          <p className="pub-pie__descripcion">{GIMNASIO.descripcionCorta}</p>
          <Redes />
        </div>
        <div>
          <h3>Navegación</h3>
          <ul>
            {NAVEGACION.map((opcion) => (
              <li key={opcion.id}>
                <button type="button" onClick={() => irASeccion(opcion.id)}>{opcion.etiqueta}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Servicios</h3>
          <ul>
            {SERVICIOS.map((servicio) => (
              <li key={servicio.nombre}>
                <button type="button" onClick={() => irASeccion("servicios")}>{servicio.nombre}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Contacto</h3>
          {datos.length > 0 ? (
            <ul>
              {datos.map((dato) => <li key={dato.etiqueta}>{dato.valor}</li>)}
            </ul>
          ) : (
            <p className="pub-pie__descripcion">Visítanos en el gimnasio.</p>
          )}
        </div>
      </div>
      <div className="pub-contenedor pub-pie__final">
        <span>© {new Date().getFullYear()} GRAVEDAD100. Todos los derechos reservados.</span>
        <div className="pub-pie__enlaces">
          <button type="button" onClick={() => setVerPrivacidad(true)}>Aviso de privacidad</button>
          <button type="button" onClick={onIniciarSesion}>Acceso del personal</button>
        </div>
      </div>
      {verPrivacidad && <AvisoPrivacidad onCerrar={() => setVerPrivacidad(false)} />}
    </footer>
  );
}

/** Boton flotante de WhatsApp: solo aparece si el numero esta configurado. */
export function BotonWhatsApp() {
  if (!CONTACTO.whatsapp) return null;
  return (
    <a
      className="pub-whatsapp"
      href={enlaceWhatsApp("Hola GRAVEDAD100, quiero información.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <IconoPublico nombre="whatsapp" tamano={28} />
    </a>
  );
}
