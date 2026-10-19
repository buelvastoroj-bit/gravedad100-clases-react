import { useState } from "react";
import { capitalizar } from "../utils/formatoClases.js";

const NIVELES = ["Principiante", "Intermedio", "Avanzado"];

/**
 * Formulario para crear un plan de entrenamiento personalizado (RF-03).
 * Recibe la lista de clientes ya cargada (del modulo de Recepcion de
 * clientes) para elegir a cual se le asigna el plan.
 * Usa el mismo diseno por secciones que FormularioClase.jsx.
 *
 * @param {{
 *   clientes: Array,
 *   onCrear: (datos: Object) => Promise<boolean>,
 *   onCancelar: () => void
 * }} props
 */
export default function FormularioPlanEntrenamiento({ clientes, onCrear, onCancelar }) {
  const [idCliente, setIdCliente] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [nivel, setNivel] = useState("Principiante");
  const [duracionSemanas, setDuracionSemanas] = useState("");
  const [observaciones, setObservaciones] = useState("");
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
    if (!objetivo.trim()) nuevosErrores.objetivo = "El objetivo es obligatorio.";
    if (!duracionSemanas || Number(duracionSemanas) <= 0) {
      nuevosErrores.duracionSemanas = "La duración debe ser un número mayor a 0.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviando(true);
      const exito = await onCrear({
        idCliente: Number(idCliente),
        objetivo: objetivo.trim(),
        nivel,
        duracionSemanas: Number(duracionSemanas),
        observaciones: observaciones.trim(),
      });
      setEnviando(false);
      if (exito) onCancelar();
    }
  }

  return (
    <div className="formulario-pagina">
      <button type="button" className="enlace-volver" onClick={onCancelar}>
        ← Volver a planes
      </button>

      <form className="formulario-clase formulario-moderno" onSubmit={manejarEnvio} noValidate>
        <div className="formulario-moderno__cabecera">
          <h2 className="formulario-moderno__titulo">Nuevo plan de entrenamiento</h2>
          <p className="formulario-moderno__subtitulo">
            Asigna a un cliente un plan según su objetivo y su nivel actual.
          </p>
        </div>

        <fieldset className="formulario-moderno__grupo">
          <legend className="formulario-moderno__leyenda">Cliente y objetivo</legend>
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

            <div className="campo">
              <label htmlFor="objetivo">Objetivo *</label>
              <input
                id="objetivo"
                type="text"
                placeholder="Ej: Perder peso, ganar masa muscular"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                aria-invalid={Boolean(errores.objetivo)}
                aria-describedby={errores.objetivo ? "error-objetivo" : undefined}
              />
              {errores.objetivo && <p id="error-objetivo" className="campo__error">{errores.objetivo}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="formulario-moderno__grupo">
          <legend className="formulario-moderno__leyenda">Nivel y duración</legend>
          <div className="rejilla-campos">
            <div className="campo">
              <span className="campo__etiqueta" id="etiqueta-nivel">Nivel *</span>
              <div className="selector-opciones" role="radiogroup" aria-labelledby="etiqueta-nivel">
                {NIVELES.map((opcion) => (
                  <label
                    key={opcion}
                    className={`selector-opciones__opcion selector-opciones__opcion--${opcion.toLowerCase()} ${
                      nivel === opcion ? "selector-opciones__opcion--activa" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="nivel"
                      value={opcion}
                      checked={nivel === opcion}
                      onChange={(e) => setNivel(e.target.value)}
                    />
                    {opcion}
                  </label>
                ))}
              </div>
            </div>

            <div className="campo">
              <label htmlFor="duracionSemanas">Duración (semanas) *</label>
              <input
                id="duracionSemanas"
                type="number"
                min="1"
                placeholder="Ej: 4"
                value={duracionSemanas}
                onChange={(e) => setDuracionSemanas(e.target.value)}
                aria-invalid={Boolean(errores.duracionSemanas)}
                aria-describedby={errores.duracionSemanas ? "error-duracion" : "ayuda-duracion"}
              />
              {errores.duracionSemanas ? (
                <p id="error-duracion" className="campo__error">{errores.duracionSemanas}</p>
              ) : (
                <p id="ayuda-duracion" className="campo__ayuda">Un mes son aproximadamente 4 semanas.</p>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="formulario-moderno__grupo">
          <legend className="formulario-moderno__leyenda">Notas</legend>
          <div className="campo">
            <label htmlFor="observaciones">Observaciones (opcional)</label>
            <textarea
              id="observaciones"
              rows="3"
              placeholder="Ej: Lesión previa en la rodilla, restricciones médicas..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
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
              {enviando ? "Creando..." : "Crear plan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
