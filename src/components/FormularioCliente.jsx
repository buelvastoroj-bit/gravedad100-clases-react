import { useState } from "react";

/**
 * Formulario para registrar un nuevo cliente en recepcion (RF-01).
 * Sigue el mismo patron visual que FormularioLogin.jsx.
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
      onRegistrar({ nombre: nombre.trim(), documento: documento.trim(), telefono: telefono.trim() });
    }
  }

  return (
    <form className="formulario-clase" onSubmit={manejarEnvio} noValidate>
      <h2 className="formulario-clase__titulo">Registrar cliente</h2>

      <div className="campo">
        <label htmlFor="nombre">Nombre completo *</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          aria-invalid={Boolean(errores.nombre)}
        />
        {errores.nombre && <p className="campo__error">{errores.nombre}</p>}
      </div>

      <div className="campo">
        <label htmlFor="documento">Numero de documento *</label>
        <input
          id="documento"
          type="text"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          aria-invalid={Boolean(errores.documento)}
        />
        {errores.documento && <p className="campo__error">{errores.documento}</p>}
      </div>

      <div className="campo">
        <label htmlFor="telefono">Telefono (opcional)</label>
        <input
          id="telefono"
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      <div className="formulario-clase__acciones">
        <button type="submit" className="boton boton--primario">
          Registrar cliente
        </button>
        <button type="button" className="boton boton--fantasma" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}