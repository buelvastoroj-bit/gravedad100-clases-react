import { useState } from "react";
import { useClases } from "./hooks/useClases.js";
import { useAuth } from "./hooks/useAuth.js";
import { useClientes } from "./hooks/useClientes.js";
import ListadoClases from "./components/ListadoClases.jsx";
import FormularioClase from "./components/FormularioClase.jsx";
import ListadoClientes from "./components/ListadoClientes.jsx";
import FormularioCliente from "./components/FormularioCliente.jsx";
import FormularioLogin from "./components/FormularioLogin.jsx";
import FormularioRegistro from "./components/FormularioRegistro.jsx";
import ModalConfirmacion from "./components/ModalConfirmacion.jsx";
import MensajeAlerta from "./components/MensajeAlerta.jsx";

const VISTA = {
  LOGIN: "login",
  REGISTRO: "registro",
  LISTADO: "listado",
  NUEVA: "nueva",
  EDITAR: "editar",
  LISTADO_CLIENTES: "listadoClientes",
  NUEVO_CLIENTE: "nuevoCliente",
};

const MODULO = {
  CLASES: "clases",
  CLIENTES: "clientes",
};

/**
 * Componente raiz de la aplicacion. A partir de esta version, incluye
 * dos modulos accesibles tras iniciar sesion: Clases y horarios, y
 * Recepcion de clientes (RF-01).
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

  const {
    clientes,
    cargando: cargandoClientes,
    mensaje: mensajeClientes,
    registrarCliente,
    registrarCheckin,
    limpiarMensaje: limpiarMensajeClientes,
  } = useClientes();

  const [moduloActivo, setModuloActivo] = useState(MODULO.CLASES);
  const [vista, setVista] = useState(VISTA.LOGIN);
  const [idEnEdicion, setIdEnEdicion] = useState(null);
  const [idParaEliminar, setIdParaEliminar] = useState(null);

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
    setModuloActivo(MODULO.CLASES);
  }

  async function manejarIniciarSesion(usuario, contrasena) {
    await iniciarSesion(usuario, contrasena);
  }

  function irAModuloClases() {
    setModuloActivo(MODULO.CLASES);
    setVista(VISTA.LISTADO);
  }

  function irAModuloClientes() {
    limpiarMensajeClientes();
    setModuloActivo(MODULO.CLIENTES);
    setVista(VISTA.LISTADO_CLIENTES);
  }

  function manejarRegistrarClienteNuevo(datos) {
    registrarCliente(datos).then(() => setVista(VISTA.LISTADO_CLIENTES));
  }

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
          {autenticado ? "Componente React" : "Acceso al sistema"}
        </p>

        {autenticado && (
          <nav style={{ marginTop: "0.75rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button type="button" className="enlace" onClick={irAModuloClases}>
              Clases y horarios
            </button>
            <button type="button" className="enlace" onClick={irAModuloClientes}>
              Recepción de clientes
            </button>
            <button type="button" className="enlace" onClick={manejarCerrarSesion}>
              Cerrar sesion
            </button>
          </nav>
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
        ) : moduloActivo === MODULO.CLIENTES ? (
          <>
            <MensajeAlerta mensaje={mensajeClientes} />
            {cargandoClientes && vista === VISTA.LISTADO_CLIENTES ? (
              <p className="listado-clases__contador">Cargando clientes desde la API...</p>
            ) : vista === VISTA.NUEVO_CLIENTE ? (
              <FormularioCliente
                onRegistrar={manejarRegistrarClienteNuevo}
                onCancelar={() => setVista(VISTA.LISTADO_CLIENTES)}
              />
            ) : (
              <ListadoClientes
                clientes={clientes}
                onCheckin={registrarCheckin}
                onRegistrarNuevo={() => {
                  limpiarMensajeClientes();
                  setVista(VISTA.NUEVO_CLIENTE);
                }}
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
        Gravedad100 · React JS + Vite
      </footer>
    </div>
  );
}