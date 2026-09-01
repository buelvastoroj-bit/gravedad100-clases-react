import { useState } from "react";
import { useClases } from "./hooks/useClases.js";
import { useAuth } from "./hooks/useAuth.js";
import ListadoClases from "./components/ListadoClases.jsx";
import FormularioClase from "./components/FormularioClase.jsx";
import FormularioLogin from "./components/FormularioLogin.jsx";
import FormularioRegistro from "./components/FormularioRegistro.jsx";
import ModalConfirmacion from "./components/ModalConfirmacion.jsx";
import MensajeAlerta from "./components/MensajeAlerta.jsx";

/** Vistas posibles del modulo, equivalentes a las rutas del backend. */
const VISTA = {
  LOGIN: "login",
  REGISTRO: "registro",
  LISTADO: "listado", // GET /clases
  NUEVA: "nueva", // GET /clases/nueva
  EDITAR: "editar", // GET /clases/editar/{id}
};

/**
 * Componente raiz del modulo "Clases y horarios" en React.
 *
 * A partir de esta version, el acceso al listado de clases requiere
 * autenticacion (evidencia de integracion del modulo Autenticacion,
 * ya construido en la API desde AA5_EV01, con una interfaz propia en
 * React).
 */
export default function App() {
  const {
    autenticado,
    cargando: cargandoAuth,
    mensaje: mensajeAuth,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
    limpiarMensaje: limpiarMensajeAuth,
  } = useAuth();

  const {
    clases,
    cargando,
    mensaje,
    programarClase,
    actualizarClase,
    eliminarClase,
    buscarClasePorId,
    limpiarMensaje,
  } = useClases();

  const [vista, setVista] = useState(VISTA.LOGIN);
  const [idEnEdicion, setIdEnEdicion] = useState(null);
  const [idParaEliminar, setIdParaEliminar] = useState(null);

  /** Vuelve al listado y limpia cualquier seleccion pendiente. */
  function irAlListado() {
    setVista(VISTA.LISTADO);
    setIdEnEdicion(null);
  }

  function manejarProgramarNueva() {
    limpiarMensaje();
    setVista(VISTA.NUEVA);
  }

  function manejarEditar(idClase) {
    limpiarMensaje();
    setIdEnEdicion(idClase);
    setVista(VISTA.EDITAR);
  }

  function manejarGuardarNueva(datos) {
    programarClase(datos).then(irAlListado);
  }

  function manejarGuardarEdicion(datos) {
    actualizarClase(idEnEdicion, datos).then(irAlListado);
  }

  function manejarSolicitarEliminar(idClase) {
    setIdParaEliminar(idClase);
  }

  function manejarConfirmarEliminar() {
    eliminarClase(idParaEliminar);
    setIdParaEliminar(null);
  }

  function manejarCerrarSesion() {
    cerrarSesion();
    setVista(VISTA.LOGIN);
  }

  async function manejarIniciarSesion(usuario, contrasena) {
    await iniciarSesion(usuario, contrasena);
  }

  // Una vez autenticado con exito, pasa automaticamente al listado.
  if (autenticado && vista === VISTA.LOGIN) {
    setVista(VISTA.LISTADO);
  }

  const claseEnEdicion = idEnEdicion != null ? buscarClasePorId(idEnEdicion) : undefined;

  return (
    <div className="pagina">
      <header className="cabecera">
        <h1>
          GRAVEDAD<span className="cabecera__acento">100</span>
        </h1>
        <p className="cabecera__subtitulo">
          {autenticado ? "Clases y horarios · Componente React" : "Acceso al sistema"}
        </p>
        {autenticado && (
          <button
            type="button"
            className="enlace"
            style={{ marginTop: "0.5rem" }}
            onClick={manejarCerrarSesion}
          >
            Cerrar sesion
          </button>
        )}
      </header>

      <main className="contenido">
        {!autenticado ? (
          <>
            <MensajeAlerta mensaje={mensajeAuth} />
            {vista === VISTA.REGISTRO ? (
              <FormularioRegistro
                onRegistrar={registrarUsuario}
                onIrALogin={() => {
                  limpiarMensajeAuth();
                  setVista(VISTA.LOGIN);
                }}
                cargando={cargandoAuth}
              />
            ) : (
              <FormularioLogin
                onIniciarSesion={manejarIniciarSesion}
                onIrARegistro={() => {
                  limpiarMensajeAuth();
                  setVista(VISTA.REGISTRO);
                }}
                cargando={cargandoAuth}
              />
            )}
          </>
        ) : (
          <>
            <MensajeAlerta mensaje={mensaje} />

            {cargando && vista === VISTA.LISTADO ? (
              <p className="listado-clases__contador">Cargando clases desde la API...</p>
            ) : (
              <>
                {vista === VISTA.LISTADO && (
                  <ListadoClases
                    clases={clases}
                    onEditar={manejarEditar}
                    onSolicitarEliminar={manejarSolicitarEliminar}
                    onProgramarNueva={manejarProgramarNueva}
                  />
                )}

                {vista === VISTA.NUEVA && (
                  <FormularioClase onGuardar={manejarGuardarNueva} onCancelar={irAlListado} />
                )}

                {vista === VISTA.EDITAR &&
                  (claseEnEdicion ? (
                    <FormularioClase
                      claseInicial={claseEnEdicion}
                      onGuardar={manejarGuardarEdicion}
                      onCancelar={irAlListado}
                    />
                  ) : (
                    <div className="alerta alerta--error">
                      No existe una clase con id {idEnEdicion}.{" "}
                      <button type="button" className="enlace" onClick={irAlListado}>
                        Volver al listado
                      </button>
                    </div>
                  ))}
              </>
            )}
          </>
        )}
      </main>

      {idParaEliminar != null && (
        <ModalConfirmacion
          titulo="Eliminar clase"
          mensaje="¿Seguro que deseas eliminar esta clase? Esta accion no se puede deshacer."
          onConfirmar={manejarConfirmarEliminar}
          onCancelar={() => setIdParaEliminar(null)}
        />
      )}

      <footer className="pie">
        Gravedad100 · Modulo de Clases y horarios · React JS + Vite
      </footer>
    </div>
  );
}
    