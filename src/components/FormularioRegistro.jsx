import { useState } from "react";

/**
 * Formulario de registro de un nuevo usuario. Incluye confirmacion de
 * contrasena en el propio cliente, ademas de las validaciones que ya
 * aplica la API del lado del servidor.
 *
 * @param {{
 *   onRegistrar: (usuario: string, contrasena: string) => Promise<boolean>,
 *   onIrALogin: () => void,
 *   cargando: boolean
 * }} props
 */
export default function FormularioRegistro({ onRegistrar, onIrALogin, cargando }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [errores, setErrores] = useState({});

  async function manejarEnvio(evento) {
    evento.preventDefault();
    const nuevosErrores = {};
    if (!usuario.trim()) nuevosErrores.usuario = "El usuario es obligatorio.";
    if (!contrasena || contrasena.length < 6) {
      nuevosErrores.contrasena = "La contrasena debe tener al menos 6 caracteres.";
    }
    if (confirmarContrasena !== contrasena) {
      nuevosErrores.confirmarContrasena = "Las contrasenas no coinciden.";
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      const exito = await onRegistrar(usuario.trim(), contrasena);
      if (exito) onIrALogin();
    }
  }

  return (
    <form className="formulario-clase" onSubmit={manejarEnvio} noValidate>
      <h2 className="formulario-clase__titulo">Crear cuenta</h2>

      <div className="campo">
        <label htmlFor="reg-usuario">Usuario *</label>
        <input
          id="reg-usuario"
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          aria-invalid={Boolean(errores.usuario)}
        />
        {errores.usuario && <p className="campo__error">{errores.usuario}</p>}
      </div>

      <div className="campo">
        <label htmlFor="reg-contrasena">Contrasena *</label>
        <input
          id="reg-contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          aria-invalid={Boolean(errores.contrasena)}
        />
        {errores.contrasena && <p className="campo__error">{errores.contrasena}</p>}
      </div>

      <div className="campo">
        <label htmlFor="reg-confirmar">Confirmar contrasena *</label>
        <input
          id="reg-confirmar"
          type="password"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
          aria-invalid={Boolean(errores.confirmarContrasena)}
        />
        {errores.confirmarContrasena && <p className="campo__error">{errores.confirmarContrasena}</p>}
      </div>

      <div className="formulario-clase__acciones">
        <button type="submit" className="boton boton--primario" disabled={cargando}>
          {cargando ? "Registrando..." : "Registrarme"}
        </button>
      </div>

      <p style={{ marginTop: "1.25rem", fontSize: "0.85rem", color: "var(--color-texto-tenue)" }}>
        Ya tienes cuenta?{" "}
        <button type="button" className="enlace" onClick={onIrALogin}>
          Inicia sesion
        </button>
      </p>
    </form>
  );
}