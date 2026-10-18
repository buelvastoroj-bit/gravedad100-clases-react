import { useCallback, useEffect, useState } from "react";
import { obtenerCheckins } from "../api/clientesApi.js";

/**
 * Carga el historial de check-ins (GET /api/checkins) para los reportes.
 * Se pide cada vez que se abre la pantalla, asi los datos estan al dia.
 */
export function useCheckins() {
  const [checkins, setCheckins] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const respuesta = await obtenerCheckins();
      setCheckins(respuesta.checkins ?? []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los check-ins.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { checkins, cargando, error, recargar: cargar };
}
