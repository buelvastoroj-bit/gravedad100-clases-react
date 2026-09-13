import { useState, useCallback, useEffect } from "react";
import * as clientesApi from "../api/clientesApi.js";

/**
 * Hook personalizado que centraliza el estado y las operaciones sobre
 * los clientes del gimnasio (registrar, listar, check-in), siguiendo el
 * mismo patron que useClases.js.
 */
export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const recargarClientes = useCallback(async () => {
    try {
      const { clientes: clientesRecibidos } = await clientesApi.obtenerClientes();
      setClientes(clientesRecibidos);
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: `No se pudo conectar con la API (${error.message}).`,
      });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    recargarClientes();
  }, [recargarClientes]);

  const registrarCliente = useCallback(async (datos) => {
    try {
      await clientesApi.registrarCliente(datos);
      setMensaje({ tipo: "exito", texto: "Cliente registrado correctamente." });
      await recargarClientes();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    }
  }, [recargarClientes]);

  const registrarCheckin = useCallback(async (idCliente) => {
    try {
      const respuesta = await clientesApi.registrarCheckin(idCliente);
      setMensaje({ tipo: "exito", texto: respuesta.mensaje });
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.message });
    }
  }, []);

  const limpiarMensaje = useCallback(() => setMensaje(null), []);

  return {
    clientes,
    cargando,
    mensaje,
    registrarCliente,
    registrarCheckin,
    limpiarMensaje,
  };
}