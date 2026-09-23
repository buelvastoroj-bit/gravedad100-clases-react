import { useState } from "react";

/**
 * Formulario para registrar una nueva solicitud de atencion (RF-04).
 *
 * @param {{
 *   clientes: Array,
 *   onRegistrar: (datos: Object) => Promise<boolean>,
 *   onCancelar: () => void
 * }} props
 */
export default function FormularioSolicitud({ clientes, onRegistrar, onCancelar }) {
  const [idCliente, setIdCliente] = useState("");
  const [asunto, setAsunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState({});

  async function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!idCliente) nuevosErrores.idCliente = "Debes elegir un cliente.";
    if (!asunto.trim()) nuevosErrores.asunto = "El asunto es obligatorio.";
    if (!descripcion.trim()) nuevosErrores.descripcion = "La descripcion es obligatoria.";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      const exito = await onRegistrar({
        idCliente: Number(idCliente),
        asunto: asunto.trim(),
        descripcion: descripcion.trim(),
      });
      if (exito) onCancelar();
    }
  }

  return (
    <form className="formulario-clase" onSubmit={manejarEnvio} noValidate>
      <h2 className="formulario-clase__titulo">Nueva solicitud</h2>

      <div className="campo">
        <label htmlFor="idCliente">Cliente *</label>
        <select id="idCliente" value={idCliente} onChange={(e) => setIdCliente(e.target.value)}>
          <option value="">-- Selecciona un cliente --</option>
          {clientes.map((c) => (
            <option key={c.idCliente} value={c.idCliente}>
              {c.nombre} ({c.documento})
            </option>
          ))}
        </select>
        {errores.idCliente && <p className="campo__error">{errores.idCliente}</p>}
      </div>

      <div className="campo">
        <label htmlFor="asunto">Asunto *</label>
        <input
          id="asunto"
          type="text"
          placeholder="Ej: Consulta sobre horario, Queja, Cambio de plan..."
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          aria-invalid={Boolean(errores.asunto)}
        />
        {errores.asunto && <p className="campo__error">{errores.asunto}</p>}
      </div>

      <div className="campo">
        <label htmlFor="descripcion">Descripcion *</label>
        <input
          id="descripcion"
          type="text"
          placeholder="Detalle de la solicitud"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          aria-invalid={Boolean(errores.descripcion)}
        />
        {errores.descripcion && <p className="campo__error">{errores.descripcion}</p>}
      </div>

      <div className="formulario-clase__acciones">
        <button type="submit" className="boton boton--primario">Registrar solicitud</button>
        <button type="button" className="boton boton--fantasma" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  );
}