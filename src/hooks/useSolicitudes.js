import { useState, useCallback, useEffect } from "react";
import * as solicitudesApi from "../api/solicitudesApi.js";

/** Hook que centraliza el estado de las solicitudes de atencion (RF-04). */
export function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const recargarSolicitudes = useCallback(async () => {
    try {
      const { solicitudes: recibidas } = await solicitudesApi.obtenerSolicitudes();
      setSolicitudes(recibidas);
    } catch (error) {
      setMensaje({ tipo: "error", texto: `No se pudo conectar con la API (${error.message}).` });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargarSolicitudes();
  }, [recargarSolicitudes]);

  const registrarSolicitud = useCallback(async (datos) => {
    try {
      await solicitudesApi.registrarSolicitud(datos);
      setMensaje({ tipo: "exito", texto: "Solicitud registrada correctamente." });
      await recargarSolicitudes();
      return true;
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
      return false;
    }
  }, [recargarSolicitudes]);

  const resolverSolicitud = useCallback(async (idSolicitud, respuesta) => {
    try {
      await solicitudesApi.resolverSolicitud(idSolicitud, respuesta);
      setMensaje({ tipo: "exito", texto: "Solicitud marcada como resuelta." });
      await recargarSolicitudes();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    }
  }, [recargarSolicitudes]);

  const limpiarMensaje = useCallback(() => setMensaje(null), []);

  return { solicitudes, cargando, mensaje, registrarSolicitud, resolverSolicitud, limpiarMensaje };
}