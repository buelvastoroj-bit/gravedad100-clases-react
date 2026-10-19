import { useState } from "react";
import { capitalizar } from "../utils/formatoClases.js";

/**
 * Formulario para registrar un nuevo cliente en recepcion (RF-01).
 * Usa el mismo diseno por secciones que FormularioClase.jsx.
 * Al guardar, el nombre se escribe con mayuscula inicial para que los datos queden consistentes.
 *
 * @param {{
 *   onRegistrar: (datos: {nombre: string, documento: string, telefono: string}) => void,
 *   onCancelar: () => void
 * }} props
 */
export default function FormularioCliente({ onRegistrar, onCancelar }) {
  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errores, setErrores] = useState({});

  function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!documento.trim()) nuevosErrores.documento = "El documento es obligatorio.";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      onRegistrar({ nombre: capitalizar(nombre), documento: documento.trim(), telefono: telefono.trim() });
    }
  }

  return (
    <div className="formulario-pagina">
      <button type="button" className="enlace-volver" onClick={onCancelar}>
        ← Volver a clientes
      </button>

      <form className="formulario-clase formulario-moderno" onSubmit={manejarEnvio} noValidate>
        <div className="formulario-moderno__cabecera">
          <h2 className="formulario-moderno__titulo">Registrar cliente</h2>
          <p className="formulario-moderno__subtitulo">
            Agrega a una persona nueva para poder hacerle check-in y asignarle planes.
          </p>
        </div>

        <fieldset className="formulario-moderno__grupo">
          <legend className="formulario-moderno__leyenda">Datos personales</legend>
          <div className="rejilla-campos">
            <div className="campo">
              <label htmlFor="nombre">Nombre completo *</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej: María Rodríguez"
                autoComplete="off"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                aria-invalid={Boolean(errores.nombre)}
                aria-describedby={errores.nombre ? "error-nombre" : undefined}
              />
              {errores.nombre && <p id="error-nombre" className="campo__error">{errores.nombre}</p>}
            </div>

            <div className="campo">
              <label htmlFor="documento">Número de documento *</label>
              <input
                id="documento"
                type="text"
                inputMode="numeric"
                placeholder="Ej: 1062425406"
                autoComplete="off"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                aria-invalid={Boolean(errores.documento)}
                aria-describedby={errores.documento ? "error-documento" : "ayuda-documento"}
              />
              {errores.documento ? (
                <p id="error-documento" className="campo__error">{errores.documento}</p>
              ) : (
                <p id="ayuda-documento" className="campo__ayuda">Cédula, tarjeta de identidad o pasaporte.</p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="formulario-moderno__grupo">
          <legend className="formulario-moderno__leyenda">Contacto</legend>
          <div className="rejilla-campos">
            <div className="campo">
              <label htmlFor="telefono">Teléfono (opcional)</label>
              <input
                id="telefono"
                type="tel"
                inputMode="tel"
                placeholder="Ej: 3001234567"
                autoComplete="off"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                aria-describedby="ayuda-telefono"
              />
              <p id="ayuda-telefono" className="campo__ayuda">Sirve para avisarle de cambios en las clases.</p>
            </div>
          </div>
        </fieldset>

        <div className="formulario-moderno__pie">
          <p className="formulario-moderno__nota">Los campos con * son obligatorios.</p>
          <div className="formulario-moderno__acciones">
            <button type="button" className="boton boton--fantasma" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="boton boton--primario">
              Registrar cliente
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
