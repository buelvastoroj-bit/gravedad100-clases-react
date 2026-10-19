import { useState } from "react";
import { capitalizar } from "../utils/formatoClases.js";

// Asuntos frecuentes: con un clic llenan el campo "Asunto"
const ASUNTOS_RAPIDOS = ["Consulta de horario", "Queja", "Sugerencia", "Cambio de plan"];

/**
 * Formulario para registrar una nueva solicitud de atencion (RF-04).
 * Usa el mismo diseno por secciones que FormularioClase.jsx.
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
  const [enviando, setEnviando] = useState(false);

  // Clientes ordenados por nombre para encontrarlos mas rapido
  const clientesOrdenados = [...clientes].sort((a, b) =>
    capitalizar(a.nombre).localeCompare(capitalizar(b.nombre))
  );

  async function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!idCliente) nuevosErrores.idCliente = "Debes elegir un cliente.";
    if (!asunto.trim()) nuevosErrores.asunto = "El asunto es obligatorio.";
    if (!descripcion.trim()) nuevosErrores.descripcion = "La descripción es obligatoria.";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviando(true);
      const exito = await onRegistrar({
        idCliente: Number(idCliente),
        asunto: asunto.trim(),
        descripcion: descripcion.trim(),
      });
      setEnviando(false);
      if (exito) onCancelar();
    }
  }

  return (
    <div className="formulario-pagina">
      <button type="button" className="enlace-volver" onClick={onCancelar}>
        ← Volver a solicitudes
      </button>

      <form className="formulario-clase formulario-moderno" onSubmit={manejarEnvio} noValidate>
        <div className="formulario-moderno__cabecera">
          <h2 className="formulario-moderno__titulo">Nueva solicitud</h2>
          <p className="formulario-moderno__subtitulo">
            Registra la petición, queja o sugerencia de un cliente para darle seguimiento.
          </p>
        </div>

        <fieldset className="formulario-moderno__grupo">
          <legend className="formulario-moderno__leyenda">Cliente</legend>
          <div className="rejilla-campos">
            <div className="campo">
              <label htmlFor="idCliente">Cliente *</label>
              <select
                id="idCliente"
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                aria-invalid={Boolean(errores.idCliente)}
                aria-describedby={errores.idCliente ? "error-cliente" : undefined}
                disabled={clientes.length === 0}
              >
                <option value="">Selecciona un cliente</option>
                {clientesOrdenados.map((c) => (
                  <option key={c.idCliente} value={c.idCliente}>
                    {capitalizar(c.nombre)} ({c.documento})
                  </option>
                ))}
              </select>
              {errores.idCliente ? (
                <p id="error-cliente" className="campo__error">{errores.idCliente}</p>
              ) : (
                clientes.length === 0 && (
                  <p className="campo__ayuda">Primero registra un cliente en el módulo de Clientes.</p>
                )
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="formulario-moderno__grupo">
          <legend className="formulario-moderno__leyenda">Detalle de la solicitud</legend>

          <div className="campo">
            <label htmlFor="asunto">Asunto *</label>
            <input
              id="asunto"
              type="text"
              placeholder="Ej: Consulta de horario, queja, cambio de plan..."
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              aria-invalid={Boolean(errores.asunto)}
              aria-describedby={errores.asunto ? "error-asunto" : undefined}
            />
            <div className="filtros-estado" role="group" aria-label="Asuntos frecuentes">
              {ASUNTOS_RAPIDOS.map((opcion) => (
                <button
                  key={opcion}
                  type="button"
                  className={`filtro-chip ${asunto === opcion ? "filtro-chip--activo" : ""}`}
                  aria-pressed={asunto === opcion}
                  onClick={() => setAsunto(opcion)}
                >
                  {opcion}
                </button>
              ))}
            </div>
            {errores.asunto && <p id="error-asunto" className="campo__error">{errores.asunto}</p>}
          </div>

          <div className="campo">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              rows="4"
              placeholder="Cuenta con detalle lo que necesita el cliente."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              aria-invalid={Boolean(errores.descripcion)}
              aria-describedby={errores.descripcion ? "error-descripcion" : undefined}
            />
            {errores.descripcion && <p id="error-descripcion" className="campo__error">{errores.descripcion}</p>}
          </div>
        </fieldset>

        <div className="formulario-moderno__pie">
          <p className="formulario-moderno__nota">Los campos con * son obligatorios.</p>
          <div className="formulario-moderno__acciones">
            <button type="button" className="boton boton--fantasma" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" className="boton boton--primario" disabled={enviando}>
              {enviando && <span className="boton__spinner" aria-hidden="true" />}
              {enviando ? "Registrando..." : "Registrar solicitud"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
