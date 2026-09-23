import { useState, useCallback, useEffect } from "react";
import * as entrenamientoApi from "../api/entrenamientoApi.js";

/** Hook que centraliza el estado de los planes de entrenamiento (RF-03). */
export function useEntrenamiento() {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const recargarPlanes = useCallback(async () => {
    try {
      const { planes: planesRecibidos } = await entrenamientoApi.obtenerPlanes();
      setPlanes(planesRecibidos);
    } catch (error) {
      setMensaje({ tipo: "error", texto: `No se pudo conectar con la API (${error.message}).` });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargarPlanes();
  }, [recargarPlanes]);

  const crearPlan = useCallback(async (datos) => {
    try {
      await entrenamientoApi.crearPlan(datos);
      setMensaje({ tipo: "exito", texto: "Plan de entrenamiento creado correctamente." });
      await recargarPlanes();
      return true;
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
      return false;
    }
  }, [recargarPlanes]);

  const eliminarPlan = useCallback(async (idPlan) => {
    try {
      await entrenamientoApi.eliminarPlan(idPlan);
      setMensaje({ tipo: "exito", texto: "Plan de entrenamiento eliminado correctamente." });
      await recargarPlanes();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    }
  }, [recargarPlanes]);

  const limpiarMensaje = useCallback(() => setMensaje(null), []);

  return { planes, cargando, mensaje, crearPlan, eliminarPlan, limpiarMensaje };
}