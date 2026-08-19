import { useState, useCallback, useEffect } from "react";
import * as clasesApi from "../api/clasesApi.js";

/**
 * Hook personalizado que centraliza el estado y las operaciones sobre las
 * clases grupales (listar, programar, editar, eliminar).
 *
 * A partir de la evidencia GA8_AA1_EV01 (integracion de modulos), este
 * hook consume la API REST real construida en AA5_EV03
 * (com.gravedad100-api) en lugar de mantener los datos en memoria local,
 * como se hacia en la version inicial del componente (AA4_EV03). La
 * interfaz publica del hook (los nombres de las funciones que devuelve)
 * se mantuvo igual a proposito, para que los componentes de presentacion
 * (ListadoClases, FormularioClase, App) no tuvieran que cambiar.
 *
 * @returns {{
 *   clases: Array,
 *   cargando: boolean,
 *   mensaje: {tipo: 'exito'|'error', texto: string}|null,
 *   programarClase: (datos: Object) => Promise<void>,
 *   actualizarClase: (id: number, datos: Object) => Promise<void>,
 *   eliminarClase: (id: number) => Promise<void>,
 *   buscarClasePorId: (id: number) => Object|undefined,
 *   limpiarMensaje: () => void
 * }}
 */
export function useClases() {
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  /** Vuelve a pedir el listado completo a la API. */
  const recargarClases = useCallback(async () => {
    try {
      const { clases: clasesRecibidas } = await clasesApi.obtenerClases();
      setClases(clasesRecibidas);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: `No se pudo conectar con la API (${error.message}). Verifica que el servidor esté corriendo en http://localhost:3000.`,
      });
    } finally {
      setCargando(false);
    }
  }, []);

  // Carga inicial del listado al montar el componente.
  useEffect(() => {
    recargarClases();
  }, [recargarClases]);

  /** Busca una clase por id dentro de lo ya cargado en memoria. */
  const buscarClasePorId = useCallback(
    (id) => clases.find((clase) => clase.idClase === id),
    [clases]
  );

  /** Programa (crea) una nueva clase grupal a traves de la API. */
  const programarClase = useCallback(async (datos) => {
    try {
      await clasesApi.crearClase(datos);
      setMensaje({ tipo: "exito", texto: "Clase programada correctamente." });
      await recargarClases();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    }
  }, [recargarClases]);

  /**
   * Actualiza una clase existente a traves de la API. Si el id no existe
   * (por ejemplo, un enlace desactualizado), la API responde 404 y ese
   * mensaje se muestra tal cual, replicando el manejo de
   * ClaseNoEncontradaException del backend original (HU-06).
   */
  const actualizarClase = useCallback(async (id, datos) => {
    try {
      await clasesApi.actualizarClase(id, datos);
      setMensaje({ tipo: "exito", texto: "Clase actualizada correctamente." });
      await recargarClases();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    }
  }, [recargarClases]);

  /** Elimina una clase por id a traves de la API. */
  const eliminarClase = useCallback(async (id) => {
    try {
      await clasesApi.eliminarClase(id);
      setMensaje({ tipo: "exito", texto: "Clase eliminada correctamente." });
      await recargarClases();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    }
  }, [recargarClases]);

  const limpiarMensaje = useCallback(() => setMensaje(null), []);

  return {
    clases,
    cargando,
    mensaje,
    programarClase,
    actualizarClase,
    eliminarClase,
    buscarClasePorId,
    limpiarMensaje,
  };
}
