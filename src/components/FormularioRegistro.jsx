import { useState } from "react";

function IconoOjo({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.6 18.6 0 0 1 4.22-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * Formulario de registro de un nuevo usuario, nivelado visualmente con
 * FormularioLogin.jsx (mismos iconos, spinner, y tono de texto).
 */
export default function FormularioRegistro({ onRegistrar, onIrALogin, cargando }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [errores, setErrores] = useState({});
  const [registroExitoso, setRegistroExitoso] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!usuario.trim()) nuevosErrores.usuario = "El usuario es obligatorio.";
    if (!contrasena || contrasena.length < 6) {
      nuevosErrores.contrasena = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (confirmarContrasena !== contrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      const exito = await onRegistrar(usuario.trim(), contrasena);
      if (exito) {
        setRegistroExitoso(true);
        setTimeout(() => onIrALogin(), 1100);
      }
    }
  }

  if (registroExitoso) {
    return (
      <div className="formulario-clase formulario-clase--acceso confirmacion-exito">
        <svg viewBox="0 0 52 52" width="52" height="52" className="confirmacion-exito__check">
          <circle cx="26" cy="26" r="25" fill="none" stroke="#3bb273" strokeWidth="2" />
          <path fill="none" stroke="#3bb273" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l7 7 17-17" />
        </svg>
        <p>¡Cuenta creada correctamente!</p>
      </div>
    );
  }

  return (
    <form className="formulario-clase formulario-clase--acceso" onSubmit={manejarEnvio} noValidate>
      <h2 className="formulario-clase__titulo">Crear cuenta</h2>

      <div className="campo">
        <label htmlFor="reg-usuario">Usuario</label>
        <input
          id="reg-usuario"
          type="text"
          placeholder="Elige un nombre de usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          aria-invalid={Boolean(errores.usuario)}
          autoFocus
        />
        {errores.usuario && <p className="campo__error">{errores.usuario}</p>}
      </div>

      <div className="campo">
        <label htmlFor="reg-contrasena">Contraseña</label>
        <div className="campo__con-icono">
          <input
            id="reg-contrasena"
            type={mostrarContrasena ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
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
            <IconoOjo visible={mostrarContrasena} />
          </button>
        </div>
        {errores.contrasena && <p className="campo__error">{errores.contrasena}</p>}
      </div>

      <div className="campo">
        <label htmlFor="reg-confirmar">Confirmar contraseña</label>
        <div className="campo__con-icono">
          <input
            id="reg-confirmar"
            type={mostrarConfirmar ? "text" : "password"}
            placeholder="Repite la contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            aria-invalid={Boolean(errores.confirmarContrasena)}
          />
          <button
            type="button"
            className="campo__boton-ojo"
            onClick={() => setMostrarConfirmar((v) => !v)}
            aria-label={mostrarConfirmar ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            <IconoOjo visible={mostrarConfirmar} />
          </button>
        </div>
        {errores.confirmarContrasena && <p className="campo__error">{errores.confirmarContrasena}</p>}
      </div>

      <div className="formulario-clase__acciones formulario-clase__acciones--full">
        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando && <span className="boton__spinner" aria-hidden="true" />}
          {cargando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </div>

      <p style={{ marginTop: "1.25rem", fontSize: "0.85rem", color: "var(--color-texto-tenue)" }}>
        ¿Ya tienes una cuenta?{" "}
        <button type="button" className="enlace" onClick={onIrALogin}>
          Iniciar sesión
        </button>
      </p>
    </form>
  );
}