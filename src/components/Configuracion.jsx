import { useState } from "react";
import { registrarUsuario } from "../api/authApi.js";

const LONGITUD_MINIMA = 6;

function IconoOjo({ abierto }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {!abierto && <path d="M3 3l18 18" />}
    </svg>
  );
}

/**
 * Pantalla de configuracion del sistema.
 * Por ahora tiene la seccion "Usuarios del sistema": como el registro publico
 * esta cerrado, aqui un usuario con sesion iniciada crea las cuentas del
 * personal del gimnasio (administrador, recepcion, entrenadores).
 *
 * Los clientes del gimnasio NO son usuarios del sistema: se registran en el
 * modulo de Clientes.
 */
export default function Configuracion() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState("");
  const [errorApi, setErrorApi] = useState("");

  function limpiarAvisos() {
    setExito("");
    setErrorApi("");
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    limpiarAvisos();

    const nuevosErrores = {};
    if (!usuario.trim()) nuevosErrores.usuario = "El nombre de usuario es obligatorio.";
    if (contrasena.length < LONGITUD_MINIMA) {
      nuevosErrores.contrasena = `La contraseña debe tener al menos ${LONGITUD_MINIMA} caracteres.`;
    }
    if (confirmacion !== contrasena) nuevosErrores.confirmacion = "Las contraseñas no coinciden.";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      const respuesta = await registrarUsuario(usuario.trim(), contrasena);
      setExito(`Cuenta creada para "${respuesta.usuario}". Ya puede iniciar sesión con su contraseña.`);
      setUsuario("");
      setContrasena("");
      setConfirmacion("");
      setVerContrasena(false);
    } catch (error) {
      // 403: la API no acepto el token (por ejemplo, la sesion de 2 horas ya vencio)
      setErrorApi(
        error.status === 403
          ? "No se pudo crear la cuenta porque tu sesión venció. Cierra sesión, vuelve a entrar e inténtalo de nuevo."
          : error.message
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="configuracion">
      <div className="encabezado-pagina">
        <h2 className="encabezado-pagina__titulo">Configuración</h2>
        <p className="encabezado-pagina__subtitulo">
          Administra las cuentas del personal que usa el sistema.
        </p>
      </div>

      <div className="formulario-pagina">
        {exito && <div className="alerta alerta--exito">{exito}</div>}
        {errorApi && <div className="alerta alerta--error">{errorApi}</div>}

        <form className="formulario-clase formulario-moderno" onSubmit={manejarEnvio} noValidate>
          <div className="formulario-moderno__cabecera">
            <h3 className="formulario-moderno__titulo">Crear usuario del sistema</h3>
            <p className="formulario-moderno__subtitulo">
              Para el personal del gimnasio (administración, recepción, entrenadores).
              Los clientes que entrenan se registran en el módulo de Clientes.
            </p>
          </div>

          <fieldset className="formulario-moderno__grupo">
            <legend className="formulario-moderno__leyenda">Datos de acceso</legend>

            <div className="rejilla-campos">
              <div className="campo">
                <label htmlFor="nuevo-usuario">Nombre de usuario *</label>
                <input
                  id="nuevo-usuario"
                  type="text"
                  placeholder="Ej: angel"
                  autoComplete="off"
                  value={usuario}
                  onChange={(e) => { setUsuario(e.target.value); limpiarAvisos(); }}
                  aria-invalid={Boolean(errores.usuario)}
                  aria-describedby={errores.usuario ? "error-nuevo-usuario" : undefined}
                />
                {errores.usuario && <p id="error-nuevo-usuario" className="campo__error">{errores.usuario}</p>}
              </div>
            </div>

            <div className="rejilla-campos">
              <div className="campo">
                <label htmlFor="nueva-contrasena">Contraseña *</label>
                <div className="campo__con-icono">
                  <input
                    id="nueva-contrasena"
                    type={verContrasena ? "text" : "password"}
                    autoComplete="new-password"
                    value={contrasena}
                    onChange={(e) => { setContrasena(e.target.value); limpiarAvisos(); }}
                    aria-invalid={Boolean(errores.contrasena)}
                    aria-describedby={errores.contrasena ? "error-nueva-contrasena" : "ayuda-contrasena"}
                  />
                  <button
                    type="button"
                    className="campo__boton-ojo"
                    onClick={() => setVerContrasena((actual) => !actual)}
                    aria-label={verContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <IconoOjo abierto={verContrasena} />
                  </button>
                </div>
                {errores.contrasena ? (
                  <p id="error-nueva-contrasena" className="campo__error">{errores.contrasena}</p>
                ) : (
                  <p id="ayuda-contrasena" className="campo__ayuda">Mínimo {LONGITUD_MINIMA} caracteres.</p>
                )}
              </div>

              <div className="campo">
                <label htmlFor="confirmar-contrasena">Confirmar contraseña *</label>
                <input
                  id="confirmar-contrasena"
                  type={verContrasena ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmacion}
                  onChange={(e) => { setConfirmacion(e.target.value); limpiarAvisos(); }}
                  aria-invalid={Boolean(errores.confirmacion)}
                  aria-describedby={errores.confirmacion ? "error-confirmacion" : undefined}
                />
                {errores.confirmacion && <p id="error-confirmacion" className="campo__error">{errores.confirmacion}</p>}
              </div>
            </div>
          </fieldset>

          <div className="formulario-moderno__pie">
            <p className="formulario-moderno__nota">
              Entrega la contraseña en persona; el sistema aún no permite recuperarla.
            </p>
            <div className="formulario-moderno__acciones">
              <button type="submit" className="boton boton--primario" disabled={enviando}>
                {enviando && <span className="boton__spinner" aria-hidden="true" />}
                {enviando ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
