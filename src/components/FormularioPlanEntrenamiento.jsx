import { useState } from "react";

/**
 * Formulario para crear un plan de entrenamiento personalizado (RF-03).
 * Recibe la lista de clientes ya cargada (del modulo de Recepcion de
 * clientes) para elegir a cual se le asigna el plan.
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

  async function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!idCliente) nuevosErrores.idCliente = "Debes elegir un cliente.";
    if (!objetivo.trim()) nuevosErrores.objetivo = "El objetivo es obligatorio.";
    if (!duracionSemanas || Number(duracionSemanas) <= 0) {
      nuevosErrores.duracionSemanas = "La duracion debe ser un numero mayor a 0.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      const exito = await onCrear({
        idCliente: Number(idCliente),
        objetivo: objetivo.trim(),
        nivel,
        duracionSemanas: Number(duracionSemanas),
        observaciones: observaciones.trim(),
      });
      if (exito) onCancelar();
    }
  }

  return (
    <form className="formulario-clase" onSubmit={manejarEnvio} noValidate>
      <h2 className="formulario-clase__titulo">Nuevo plan de entrenamiento</h2>

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
        <label htmlFor="objetivo">Objetivo *</label>
        <input
          id="objetivo"
          type="text"
          placeholder="Ej: Perder peso, Ganar masa muscular, Resistencia"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          aria-invalid={Boolean(errores.objetivo)}
        />
        {errores.objetivo && <p className="campo__error">{errores.objetivo}</p>}
      </div>

      <div className="campo">
        <label htmlFor="nivel">Nivel *</label>
        <select id="nivel" value={nivel} onChange={(e) => setNivel(e.target.value)}>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      <div className="campo">
        <label htmlFor="duracionSemanas">Duracion (semanas) *</label>
        <input
          id="duracionSemanas"
          type="number"
          min="1"
          value={duracionSemanas}
          onChange={(e) => setDuracionSemanas(e.target.value)}
          aria-invalid={Boolean(errores.duracionSemanas)}
        />
        {errores.duracionSemanas && <p className="campo__error">{errores.duracionSemanas}</p>}
      </div>

      <div className="campo">
        <label htmlFor="observaciones">Observaciones (opcional)</label>
        <input
          id="observaciones"
          type="text"
          placeholder="Ej: Lesion previa, restricciones medicas..."
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </div>

      <div className="formulario-clase__acciones">
        <button type="submit" className="boton boton--primario">Crear plan</button>
        <button type="button" className="boton boton--fantasma" onClick={onCancelar}>Cancelar</button>
      </div>
    </form>
  );
}