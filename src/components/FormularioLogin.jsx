import { useState } from "react";

/**
 * Formulario de inicio de sesion. Sigue el mismo patron visual y de
 * validacion que FormularioClase.jsx (clases .formulario-clase, .campo).
 *
 * @param {{
 *   onIniciarSesion: (usuario: string, contrasena: string) => void,
 *   onIrARegistro: () => void,
 *   cargando: boolean
 * }} props
 */
export default function FormularioLogin({ onIniciarSesion, onIrARegistro, cargando }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState({});

  function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!usuario.trim()) nuevosErrores.usuario = "El usuario es obligatorio.";
    if (!contrasena) nuevosErrores.contrasena = "La contrasena es obligatoria.";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      onIniciarSesion(usuario.trim(), contrasena);
    }
  }

  return (
    <form className="formulario-clase" onSubmit={manejarEnvio} noValidate>
      <h2 className="formulario-clase__titulo">Iniciar sesion</h2>

      <div className="campo">
        <label htmlFor="usuario">Usuario *</label>
        <input
          id="usuario"
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          aria-invalid={Boolean(errores.usuario)}
        />
        {errores.usuario && <p className="campo__error">{errores.usuario}</p>}
      </div>

      <div className="campo">
        <label htmlFor="contrasena">Contrasena *</label>
        <input
          id="contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          aria-invalid={Boolean(errores.contrasena)}
        />
        {errores.contrasena && <p className="campo__error">{errores.contrasena}</p>}
      </div>

      <div className="formulario-clase__acciones">
        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando ? "Ingresando..." : "Iniciar sesion"}
        </button>
      </div>

      <p style={{ marginTop: "1.25rem", fontSize: "0.85rem", color: "var(--color-texto-tenue)" }}>
        No tienes cuenta?{" "}
        <button type="button" className="enlace" onClick={onIrARegistro}>
          Registrate
        </button>
      </p>
    </form>
  );
}