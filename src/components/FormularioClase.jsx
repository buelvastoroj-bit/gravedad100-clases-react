import { useState } from "react";
import { DIAS_SEMANA } from "../data/ClaseGrupal.js";
import { validarClase, esValido } from "../utils/validaciones.js";

const VALORES_VACIOS = {
  nombre: "",
  entrenador: "",
  diaSemana: DIAS_SEMANA[0],
  horaInicio: "",
  horaFin: "",
  cupoMaximo: "",
};

/**
 * Formulario de "Programar nueva clase" / "Editar clase".
 *
 * Un mismo componente atiende los dos casos de uso (HU-02 y HU-03): si
 * recibe una `claseInicial` por props, se comporta como formulario de
 * edicion (precargado); si no la recibe, se comporta como formulario de
 * creacion (vacio). Este es el mismo enfoque que usa formulario.jsp en
 * el backend, reutilizando una unica vista para ambos flujos.
 *
 * @param {{
 *   claseInicial?: import('../data/ClaseGrupal.js').ClaseGrupal,
 *   onGuardar: (datos: Object) => void,
 *   onCancelar: () => void
 * }} props
 */
export default function FormularioClase({ claseInicial, onGuardar, onCancelar }) {
  const esEdicion = Boolean(claseInicial);
  const [valores, setValores] = useState(claseInicial ?? VALORES_VACIOS);
  const [errores, setErrores] = useState({});

  /** Actualiza un campo del formulario a medida que el usuario escribe. */
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((actuales) => ({ ...actuales, [name]: value }));
  }

  /** Valida y, si todo esta correcto, delega el guardado al componente padre. */
  function manejarEnvio(evento) {
    evento.preventDefault();
    const erroresEncontrados = validarClase(valores);
    setErrores(erroresEncontrados);
    if (esValido(erroresEncontrados)) {
      onGuardar(valores);
    }
  }

  return (
    <form className="formulario-clase" onSubmit={manejarEnvio} noValidate>
      <h2 className="formulario-clase__titulo">
        {esEdicion ? "Editar clase" : "Programar nueva clase"}
      </h2>

      <div className="campo">
        <label htmlFor="nombre">Nombre de la clase *</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={valores.nombre}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? "error-nombre" : undefined}
        />
        {errores.nombre && (
          <p id="error-nombre" className="campo__error">
            {errores.nombre}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="entrenador">Entrenador *</label>
        <input
          id="entrenador"
          name="entrenador"
          type="text"
          value={valores.entrenador}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.entrenador)}
          aria-describedby={errores.entrenador ? "error-entrenador" : undefined}
        />
        {errores.entrenador && (
          <p id="error-entrenador" className="campo__error">
            {errores.entrenador}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor="diaSemana">Dia de la semana *</label>
        <select id="diaSemana" name="diaSemana" value={valores.diaSemana} onChange={manejarCambio}>
          {DIAS_SEMANA.map((dia) => (
            <option key={dia} value={dia}>
              {dia}
            </option>
          ))}
        </select>
      </div>

      <div className="campo campo--cupo">
        <label htmlFor="cupoMaximo">Cupo maximo *</label>
        <input
          id="cupoMaximo"
          name="cupoMaximo"
          type="number"
          min="1"
          value={valores.cupoMaximo}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.cupoMaximo)}
          aria-describedby={errores.cupoMaximo ? "error-cupo" : undefined}
        />
        {errores.cupoMaximo && (
          <p id="error-cupo" className="campo__error">
            {errores.cupoMaximo}
          </p>
        )}
      </div>

      <div className="campo-doble">
        <div className="campo">
          <label htmlFor="horaInicio">Hora de inicio *</label>
          <input
            id="horaInicio"
            name="horaInicio"
            type="time"
            value={valores.horaInicio}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.horaInicio)}
          />
          {errores.horaInicio && <p className="campo__error">{errores.horaInicio}</p>}
        </div>
        <div className="campo">
          <label htmlFor="horaFin">Hora de fin *</label>
          <input
            id="horaFin"
            name="horaFin"
            type="time"
            value={valores.horaFin}
            onChange={manejarCambio}
            aria-invalid={Boolean(errores.horaFin)}
          />
          {errores.horaFin && <p className="campo__error">{errores.horaFin}</p>}
        </div>
      </div>

      <div className="formulario-clase__acciones">
        <button type="submit" className="boton boton--primario">
          {esEdicion ? "Guardar cambios" : "Programar clase"}
        </button>
        <button type="button" className="boton boton--fantasma" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
