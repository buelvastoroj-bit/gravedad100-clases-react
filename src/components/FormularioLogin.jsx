import { useState } from "react";

export default function FormularioLogin({ onIniciarSesion, onIrARegistro, cargando }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errores, setErrores] = useState({});

  function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!usuario.trim()) nuevosErrores.usuario = "El usuario es obligatorio.";
    if (!contrasena) nuevosErrores.contrasena = "La contraseña es obligatoria.";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      onIniciarSesion(usuario.trim(), contrasena);
    }
  }

  return (
    <form className="formulario-clase formulario-clase--acceso" onSubmit={manejarEnvio} noValidate>
      <h2 className="formulario-clase__titulo">Iniciar sesión</h2>

      <div className="campo">
        <label htmlFor="usuario">Usuario</label>
        <input
          id="usuario"
          type="text"
          placeholder="Tu nombre de usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          aria-invalid={Boolean(errores.usuario)}
          autoFocus
        />
        {errores.usuario && <p className="campo__error">{errores.usuario}</p>}
      </div>

      <div className="campo">
        <label htmlFor="contrasena">Contraseña</label>
        <div className="campo__con-icono">
          <input
            id="contrasena"
            type={mostrarContrasena ? "text" : "password"}
            placeholder="Tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            aria-invalid={Boolean(errores.contrasena)}
          />
          <button
            type="button"
            className="campo__boton-ojo"
            onClick={() => setMostrarContrasena((v) => !v)}
            aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {mostrarContrasena ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.6 18.6 0 0 1 4.22-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {errores.contrasena && <p className="campo__error">{errores.contrasena}</p>}
        <button
          type="button"
          className="enlace enlace--pequeno"
          onClick={() => alert("Por ahora, contacta al administrador del sistema para restablecer tu contraseña.")}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <div className="campo-checkbox">
        <input
          id="recordarme"
          type="checkbox"
          checked={recordarme}
          onChange={(e) => setRecordarme(e.target.checked)}
        />
        <label htmlFor="recordarme">Recordarme</label>
      </div>

      <div className="formulario-clase__acciones formulario-clase__acciones--full">
        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando && <span className="boton__spinner" aria-hidden="true" />}
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </div>

      <p style={{ marginTop: "1.25rem", fontSize: "0.85rem", color: "var(--color-texto-tenue)" }}>
        ¿No tienes cuenta?{" "}
        <button type="button" className="enlace" onClick={onIrARegistro}>
          Regístrate
        </button>
      </p>
    </form>
  );
}