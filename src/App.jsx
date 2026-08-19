import { useState } from "react";
import { useClases } from "./hooks/useClases.js";
import ListadoClases from "./components/ListadoClases.jsx";
import FormularioClase from "./components/FormularioClase.jsx";
import ModalConfirmacion from "./components/ModalConfirmacion.jsx";
import MensajeAlerta from "./components/MensajeAlerta.jsx";

/** Vistas posibles del modulo, equivalentes a las rutas del backend. */
const VISTA = {
  LISTADO: "listado", // GET /clases
  NUEVA: "nueva", // GET /clases/nueva
  EDITAR: "editar", // GET /clases/editar/{id}
};

/**
 * Componente raiz del modulo "Clases y horarios" en React.
 *
 * Reproduce en el frontend, con un unico componente de pagina y estado
 * local, el mismo flujo de pantallas que ClaseController expone en el
 * backend (listar, programar, editar, eliminar), manteniendo las mismas
 * historias de usuario (HU-01 a HU-06) definidas y probadas en las
 * evidencias AA3_EV01 y AA3_EV02.
 */
export default function App() {
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

  const [vista, setVista] = useState(VISTA.LISTADO);
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

  const claseEnEdicion = idEnEdicion != null ? buscarClasePorId(idEnEdicion) : undefined;

  return (
    <div className="pagina">
      <header className="cabecera">
        <h1>
          GRAVEDAD<span className="cabecera__acento">100</span>
        </h1>
        <p className="cabecera__subtitulo">Clases y horarios · Componente React</p>
      </header>

      <main className="contenido">
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
                // Caso HU-06: id inexistente. En vez de romper la interfaz,
                // se informa el error y se ofrece volver al listado.
                <div className="alerta alerta--error">
                  No existe una clase con id {idEnEdicion}.{" "}
                  <button type="button" className="enlace" onClick={irAlListado}>
                    Volver al listado
                  </button>
                </div>
              ))}
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
