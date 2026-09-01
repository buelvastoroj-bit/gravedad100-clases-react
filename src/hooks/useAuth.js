import { useState, useCallback } from "react";
import * as authApi from "../api/authApi.js";

/**
 * Hook personalizado que centraliza el estado y las operaciones de
 * autenticacion (registro e inicio de sesion), siguiendo el mismo patron
 * que useClases.js.
 *
 * La sesion se maneja unicamente en memoria (estado de React), ya que la
 * API actual no emite un token; se pierde al recargar la pagina. Queda
 * como mejora pendiente para una proxima iteracion del proyecto.
 */
export function useAuth() {
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const iniciarSesion = useCallback(async (usuario, contrasena) => {
    setCargando(true);
    try {
      await authApi.iniciarSesion(usuario, contrasena);
      setAutenticado(true);
      setMensaje(null);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    } finally {
      setCargando(false);
    }
  }, []);

  const registrarUsuario = useCallback(async (usuario, contrasena) => {
    setCargando(true);
    try {
      await authApi.registrarUsuario(usuario, contrasena);
      setMensaje({
        tipo: "exito",
        texto: "Usuario registrado correctamente. Ya puedes iniciar sesion.",
      });
      return true;
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
      return false;
    } finally {
      setCargando(false);
    }
  }, []);

  const cerrarSesion = useCallback(() => {
    setAutenticado(false);
    setMensaje(null);
  }, []);

  const limpiarMensaje = useCallback(() => setMensaje(null), []);

  return {
    autenticado,
    cargando,
    mensaje,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
    limpiarMensaje,
  };
}