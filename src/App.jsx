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
import IndicadorCarga from "./components/IndicadorCarga.jsx";
import IlustracionPesas from "./components/IlustracionPesas.jsx";
import ModuloProximamente from "./components/ModuloProximamente.jsx";
import {
  IconoDashboard, IconoClientes, IconoCalendario, IconoPesa, IconoTarjeta,
  IconoGrafica, IconoAuriculares, IconoAjustes, IconoSalir, IconoMenu,
} from "./components/Iconos.jsx";

const VISTA = {
  LOGIN: "login", REGISTRO: "registro",
  LISTADO: "listado", NUEVA: "nueva", EDITAR: "editar",
  LISTADO_CLIENTES: "listadoClientes", NUEVO_CLIENTE: "nuevoCliente",
  LISTADO_PLANES: "listadoPlanes", NUEVO_PLAN: "nuevoPlan",
  LISTADO_SOLICITUDES: "listadoSolicitudes", NUEVA_SOLICITUD: "nuevaSolicitud",
};

const MODULO = {
  DASHBOARD: "dashboard",
  CLASES: "clases", CLIENTES: "clientes", ENTRENAMIENTO: "entrenamiento", ATENCION: "atencion",
  MEMBRESIAS: "membresias", REPORTES: "reportes", CONFIGURACION: "configuracion",
};

// Modulos que aun no estan construidos: se muestran con la pantalla "Proximamente"
const MODULOS_PROXIMAMENTE = {
  [MODULO.DASHBOARD]: {
    titulo: "Dashboard",
    descripcion: "Aquí verás el resumen general del gimnasio: clientes, clases del día y próximas clases.",
    Icono: IconoDashboard,
  },
  [MODULO.MEMBRESIAS]: {
    titulo: "Membresías y pagos",
    descripcion: "Aquí podrás registrar los pagos de los clientes y saber quién está al día.",
    Icono: IconoTarjeta,
  },
  [MODULO.REPORTES]: {
    titulo: "Reportes",
    descripcion: "Aquí podrás consultar reportes de asistencia, clases e ingresos.",
    Icono: IconoGrafica,
  },
  [MODULO.CONFIGURACION]: {
    titulo: "Configuración",
    descripcion: "Aquí podrás ajustar los datos del gimnasio y los usuarios del sistema.",
    Icono: IconoAjustes,
  },
};

const TEXTO_PIE = `© ${new Date().getFullYear()} GRAVEDAD100 · Sistema de gestión de gimnasio`;

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
  const [menuAbierto, setMenuAbierto] = useState(false);

  function irAlListado() { setVista(VISTA.LISTADO); setIdEnEdicion(null); }
  function manejarProgramarNueva() { limpiarMensaje(); setVista(VISTA.NUEVA); }
  function manejarEditar(idClase) { limpiarMensaje(); setIdEnEdicion(idClase); setVista(VISTA.EDITAR); }
  function manejarGuardarNueva(datos) { programarClase(datos).then(irAlListado); }
  function manejarGuardarEdicion(datos) { actualizarClase(idEnEdicion, datos).then(irAlListado); }
  function manejarSolicitarEliminar(idClase) { setIdParaEliminar(idClase); }
  function manejarConfirmarEliminar() { eliminarClase(idParaEliminar); setIdParaEliminar(null); }

  function manejarCerrarSesion() {
    cerrarSesion(); setVista(VISTA.LOGIN); setModuloActivo(MODULO.CLASES); setMenuAbierto(false);
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

  // Al elegir una opcion del menu se ejecuta su accion y se cierra el menu en celular
  function navegar(accion) {
    accion();
    setMenuAbierto(false);
  }

  const opcionesMenu = [
    { modulo: MODULO.DASHBOARD, etiqueta: "Dashboard", Icono: IconoDashboard, accion: () => setModuloActivo(MODULO.DASHBOARD) },
    { modulo: MODULO.CLIENTES, etiqueta: "Clientes", Icono: IconoClientes, accion: irAModuloClientes },
    { modulo: MODULO.CLASES, etiqueta: "Clases y horarios", Icono: IconoCalendario, accion: irAModuloClases },
    { modulo: MODULO.ENTRENAMIENTO, etiqueta: "Entrenamiento personalizado", Icono: IconoPesa, accion: irAModuloEntrenamiento },
    { modulo: MODULO.MEMBRESIAS, etiqueta: "Membresías y pagos", Icono: IconoTarjeta, accion: () => setModuloActivo(MODULO.MEMBRESIAS) },
    { modulo: MODULO.REPORTES, etiqueta: "Reportes", Icono: IconoGrafica, accion: () => setModuloActivo(MODULO.REPORTES) },
    { modulo: MODULO.ATENCION, etiqueta: "Atención al cliente", Icono: IconoAuriculares, accion: irAModuloAtencion },
    { modulo: MODULO.CONFIGURACION, etiqueta: "Configuración", Icono: IconoAjustes, accion: () => setModuloActivo(MODULO.CONFIGURACION) },
  ];

  if (autenticado && vista === VISTA.LOGIN) {
    setVista(VISTA.LISTADO);
  }

  const claseEnEdicion = idEnEdicion != null ? buscarClasePorId(idEnEdicion) : undefined;

  // ---------- Pantalla de acceso (sin sesion iniciada) ----------
  if (!autenticado) {
    return (
      <div className="pagina">
        <main className="contenido">
          <div className="pantalla-acceso">
            <div className="columna-marca">
              <div className="bloque-marca">
                <h1>GRAVEDAD<span className="cabecera__acento">100</span></h1>
                <p className="cabecera__subtitulo">Tu gimnasio, bajo control</p>
              </div>
              <IlustracionPesas />
            </div>
            <div className="contenedor-formulario-acceso" key={vista}>
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
            </div>
          </div>
        </main>
        <footer className="pie">{TEXTO_PIE}</footer>
      </div>
    );
  }

  // ---------- Contenido del modulo activo ----------
  function renderizarModulo() {
    const proximamente = MODULOS_PROXIMAMENTE[moduloActivo];
    if (proximamente) {
      return (
        <ModuloProximamente
          titulo={proximamente.titulo}
          descripcion={proximamente.descripcion}
          Icono={proximamente.Icono}
        />
      );
    }

    if (moduloActivo === MODULO.CLIENTES) {
      return (
        <>
          <MensajeAlerta mensaje={mensajeClientes} />
          {cargandoClientes && vista === VISTA.LISTADO_CLIENTES ? (
            <IndicadorCarga texto="Cargando clientes desde la API..." />
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
      );
    }

    if (moduloActivo === MODULO.ENTRENAMIENTO) {
      return (
        <>
          <MensajeAlerta mensaje={mensajePlanes} />
          {cargandoPlanes && vista === VISTA.LISTADO_PLANES ? (
            <IndicadorCarga texto="Cargando planes desde la API..." />
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
      );
    }

    if (moduloActivo === MODULO.ATENCION) {
      return (
        <>
          <MensajeAlerta mensaje={mensajeSolicitudes} />
          {cargandoSolicitudes && vista === VISTA.LISTADO_SOLICITUDES ? (
            <IndicadorCarga texto="Cargando solicitudes desde la API..." />
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
      );
    }

    // Modulo de clases (por defecto)
    return (
      <>
        <MensajeAlerta mensaje={mensaje} />
        {cargando && vista === VISTA.LISTADO ? (
          <IndicadorCarga texto="Cargando clases desde la API..." />
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
    );
  }

  // ---------- Sistema interno (con sesion iniciada) ----------
  return (
    <div className="app">
      <aside className={`barra-lateral ${menuAbierto ? "barra-lateral--abierta" : ""}`}>
        <div className="barra-lateral__marca">
          <h1>GRAVEDAD<span className="cabecera__acento">100</span></h1>
          <p>Sistema de gestión de gimnasio</p>
        </div>

        <nav className="menu" aria-label="Menú principal">
          {opcionesMenu.map((opcion) => {
            const activa = moduloActivo === opcion.modulo;
            return (
              <button
                key={opcion.modulo}
                type="button"
                className={`menu__opcion ${activa ? "menu__opcion--activa" : ""}`}
                aria-current={activa ? "page" : undefined}
                onClick={() => navegar(opcion.accion)}
              >
                <opcion.Icono />
                <span className="menu__texto">{opcion.etiqueta}</span>
                {MODULOS_PROXIMAMENTE[opcion.modulo] && <span className="menu__pronto">Pronto</span>}
              </button>
            );
          })}
        </nav>

        <div className="menu__separador" />
        <button type="button" className="menu__opcion menu__opcion--salir" onClick={manejarCerrarSesion}>
          <IconoSalir />
          <span className="menu__texto">Cerrar sesión</span>
        </button>
      </aside>

      {menuAbierto && <div className="fondo-menu" onClick={() => setMenuAbierto(false)} />}

      <div className="app__principal">
        <header className="barra-movil">
          <button
            type="button"
            className="barra-movil__boton"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
          >
            <IconoMenu />
          </button>
          <span className="barra-movil__marca">GRAVEDAD<span className="cabecera__acento">100</span></span>
        </header>

        <main className="app__contenido">{renderizarModulo()}</main>

        <footer className="pie">{TEXTO_PIE}</footer>
      </div>

      {idParaEliminar != null && (
        <ModalConfirmacion
          titulo="Eliminar clase"
          mensaje="¿Seguro que deseas eliminar esta clase? Esta acción no se puede deshacer."
          onConfirmar={manejarConfirmarEliminar}
          onCancelar={() => setIdParaEliminar(null)}
        />
      )}
      {idPlanParaEliminar != null && (
        <ModalConfirmacion
          titulo="Eliminar plan de entrenamiento"
          mensaje="¿Seguro que deseas eliminar este plan? Esta acción no se puede deshacer."
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
    </div>
  );
}
