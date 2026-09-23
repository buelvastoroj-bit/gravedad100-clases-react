import { useState } from "react";
import { useClases } from "./hooks/useClases.js";
import { useAuth } from "./hooks/useAuth.js";
import { useClientes } from "./hooks/useClientes.js";
import { useEntrenamiento } from "./hooks/useEntrenamiento.js";
import { useSolicitudes } from "./hooks/useSolicitudes.js";
import ListadoClases from "./components/ListadoClases.jsx";
import FormularioClase from "./components/FormularioClase.jsx";
import ListadoClientes from "./components/ListadoClientes.jsx";
import FormularioCliente from "./components/FormularioCliente.jsx";
import ListadoPlanes from "./components/ListadoPlanes.jsx";
import FormularioPlanEntrenamiento from "./components/FormularioPlanEntrenamiento.jsx";
import ListadoSolicitudes from "./components/ListadoSolicitudes.jsx";
import FormularioSolicitud from "./components/FormularioSolicitud.jsx";
import ModalResolver from "./components/ModalResolver.jsx";
import FormularioLogin from "./components/FormularioLogin.jsx";
import FormularioRegistro from "./components/FormularioRegistro.jsx";
import ModalConfirmacion from "./components/ModalConfirmacion.jsx";
import MensajeAlerta from "./components/MensajeAlerta.jsx";

const VISTA = {
  LOGIN: "login", REGISTRO: "registro",
  LISTADO: "listado", NUEVA: "nueva", EDITAR: "editar",
  LISTADO_CLIENTES: "listadoClientes", NUEVO_CLIENTE: "nuevoCliente",
  LISTADO_PLANES: "listadoPlanes", NUEVO_PLAN: "nuevoPlan",
  LISTADO_SOLICITUDES: "listadoSolicitudes", NUEVA_SOLICITUD: "nuevaSolicitud",
};

const MODULO = {
  CLASES: "clases", CLIENTES: "clientes", ENTRENAMIENTO: "entrenamiento", ATENCION: "atencion",
};

export default function App() {
  const {
    autenticado, cargando: cargandoAuth, mensaje: mensajeAuth,
    iniciarSesion, registrarUsuario, cerrarSesion, limpiarMensaje: limpiarMensajeAuth,
  } = useAuth();

  const {
    clases, cargando, mensaje, programarClase, actualizarClase,
    eliminarClase, buscarClasePorId, limpiarMensaje,
  } = useClases();

  const {
    clientes, cargando: cargandoClientes, mensaje: mensajeClientes,
    registrarCliente, registrarCheckin, limpiarMensaje: limpiarMensajeClientes,
  } = useClientes();

  const {
    planes, cargando: cargandoPlanes, mensaje: mensajePlanes,
    crearPlan, eliminarPlan, limpiarMensaje: limpiarMensajePlanes,
  } = useEntrenamiento();

  const {
    solicitudes, cargando: cargandoSolicitudes, mensaje: mensajeSolicitudes,
    registrarSolicitud, resolverSolicitud, limpiarMensaje: limpiarMensajeSolicitudes,
  } = useSolicitudes();

  const [moduloActivo, setModuloActivo] = useState(MODULO.CLASES);
  const [vista, setVista] = useState(VISTA.LOGIN);
  const [idEnEdicion, setIdEnEdicion] = useState(null);
  const [idParaEliminar, setIdParaEliminar] = useState(null);
  const [idPlanParaEliminar, setIdPlanParaEliminar] = useState(null);
  const [solicitudParaResolver, setSolicitudParaResolver] = useState(null);

  function irAlListado() { setVista(VISTA.LISTADO); setIdEnEdicion(null); }
  function manejarProgramarNueva() { limpiarMensaje(); setVista(VISTA.NUEVA); }
  function manejarEditar(idClase) { limpiarMensaje(); setIdEnEdicion(idClase); setVista(VISTA.EDITAR); }
  function manejarGuardarNueva(datos) { programarClase(datos).then(irAlListado); }
  function manejarGuardarEdicion(datos) { actualizarClase(idEnEdicion, datos).then(irAlListado); }
  function manejarSolicitarEliminar(idClase) { setIdParaEliminar(idClase); }
  function manejarConfirmarEliminar() { eliminarClase(idParaEliminar); setIdParaEliminar(null); }

  function manejarCerrarSesion() {
    cerrarSesion(); setVista(VISTA.LOGIN); setModuloActivo(MODULO.CLASES);
  }
  async function manejarIniciarSesion(usuario, contrasena) { await iniciarSesion(usuario, contrasena); }

  function irAModuloClases() { setModuloActivo(MODULO.CLASES); setVista(VISTA.LISTADO); }
  function irAModuloClientes() { limpiarMensajeClientes(); setModuloActivo(MODULO.CLIENTES); setVista(VISTA.LISTADO_CLIENTES); }
  function irAModuloEntrenamiento() { limpiarMensajePlanes(); setModuloActivo(MODULO.ENTRENAMIENTO); setVista(VISTA.LISTADO_PLANES); }
  function irAModuloAtencion() { limpiarMensajeSolicitudes(); setModuloActivo(MODULO.ATENCION); setVista(VISTA.LISTADO_SOLICITUDES); }

  function manejarRegistrarClienteNuevo(datos) {
    registrarCliente(datos).then(() => setVista(VISTA.LISTADO_CLIENTES));
  }
  function manejarSolicitarEliminarPlan(idPlan) { setIdPlanParaEliminar(idPlan); }
  function manejarConfirmarEliminarPlan() { eliminarPlan(idPlanParaEliminar); setIdPlanParaEliminar(null); }

  function manejarConfirmarResolver(respuesta) {
    resolverSolicitud(solicitudParaResolver.idSolicitud, respuesta);
    setSolicitudParaResolver(null);
  }

  if (autenticado && vista === VISTA.LOGIN) {
    setVista(VISTA.LISTADO);
  }

  const claseEnEdicion = idEnEdicion != null ? buscarClasePorId(idEnEdicion) : undefined;

  return (
    <div className="pagina">
      <header className="cabecera">
        <h1>GRAVEDAD<span className="cabecera__acento">100</span></h1>
        <p className="cabecera__subtitulo">{autenticado ? "Componente React" : "Acceso al sistema"}</p>

        {autenticado && (
          <nav style={{ marginTop: "0.75rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" className="enlace" onClick={irAModuloClases}>Clases y horarios</button>
            <button type="button" className="enlace" onClick={irAModuloClientes}>Recepción de clientes</button>
            <button type="button" className="enlace" onClick={irAModuloEntrenamiento}>Entrenamiento personalizado</button>
            <button type="button" className="enlace" onClick={irAModuloAtencion}>Atención al cliente</button>
            <button type="button" className="enlace" onClick={manejarCerrarSesion}>Cerrar sesion</button>
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
                onIrALogin={() => { limpiarMensajeAuth(); setVista(VISTA.LOGIN); }}
                cargando={cargandoAuth}
              />
            ) : (
              <FormularioLogin
                onIniciarSesion={manejarIniciarSesion}
                onIrARegistro={() => { limpiarMensajeAuth(); setVista(VISTA.REGISTRO); }}
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
              <FormularioCliente onRegistrar={manejarRegistrarClienteNuevo} onCancelar={() => setVista(VISTA.LISTADO_CLIENTES)} />
            ) : (
              <ListadoClientes
                clientes={clientes}
                onCheckin={registrarCheckin}
                onRegistrarNuevo={() => { limpiarMensajeClientes(); setVista(VISTA.NUEVO_CLIENTE); }}
              />
            )}
          </>
        ) : moduloActivo === MODULO.ENTRENAMIENTO ? (
          <>
            <MensajeAlerta mensaje={mensajePlanes} />
            {cargandoPlanes && vista === VISTA.LISTADO_PLANES ? (
              <p className="listado-clases__contador">Cargando planes desde la API...</p>
            ) : vista === VISTA.NUEVO_PLAN ? (
              <FormularioPlanEntrenamiento clientes={clientes} onCrear={crearPlan} onCancelar={() => setVista(VISTA.LISTADO_PLANES)} />
            ) : (
              <ListadoPlanes
                planes={planes}
                onSolicitarEliminar={manejarSolicitarEliminarPlan}
                onCrearNuevo={() => { limpiarMensajePlanes(); setVista(VISTA.NUEVO_PLAN); }}
              />
            )}
          </>
        ) : moduloActivo === MODULO.ATENCION ? (
          <>
            <MensajeAlerta mensaje={mensajeSolicitudes} />
            {cargandoSolicitudes && vista === VISTA.LISTADO_SOLICITUDES ? (
              <p className="listado-clases__contador">Cargando solicitudes desde la API...</p>
            ) : vista === VISTA.NUEVA_SOLICITUD ? (
              <FormularioSolicitud clientes={clientes} onRegistrar={registrarSolicitud} onCancelar={() => setVista(VISTA.LISTADO_SOLICITUDES)} />
            ) : (
              <ListadoSolicitudes
                solicitudes={solicitudes}
                onResolver={(solicitud) => setSolicitudParaResolver(solicitud)}
                onRegistrarNueva={() => { limpiarMensajeSolicitudes(); setVista(VISTA.NUEVA_SOLICITUD); }}
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
                    <FormularioClase claseInicial={claseEnEdicion} onGuardar={manejarGuardarEdicion} onCancelar={irAlListado} />
                  ) : (
                    <div className="alerta alerta--error">
                      No existe una clase con id {idEnEdicion}.{" "}
                      <button type="button" className="enlace" onClick={irAlListado}>Volver al listado</button>
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
      {idPlanParaEliminar != null && (
        <ModalConfirmacion
          titulo="Eliminar plan de entrenamiento"
          mensaje="¿Seguro que deseas eliminar este plan? Esta accion no se puede deshacer."
          onConfirmar={manejarConfirmarEliminarPlan}
          onCancelar={() => setIdPlanParaEliminar(null)}
        />
      )}
      {solicitudParaResolver != null && (
        <ModalResolver
          solicitud={solicitudParaResolver}
          onConfirmar={manejarConfirmarResolver}
          onCancelar={() => setSolicitudParaResolver(null)}
        />
      )}

      <footer className="pie">Gravedad100 · React JS + Vite</footer>
    </div>
  );
}