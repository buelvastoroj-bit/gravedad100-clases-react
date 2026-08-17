import { useState, useCallback } from "react";
import { CLASES_INICIALES } from "../data/clasesIniciales.js";
import { crearClaseGrupal } from "../data/ClaseGrupal.js";

/**
 * Hook personalizado que centraliza el estado y las operaciones sobre las
 * clases grupales (listar, programar, editar, eliminar).
 *
 * Cumple, en el frontend, el mismo rol que ClaseServicio cumple en el
 * backend: aisla la logica de negocio de los componentes de presentacion,
 * para que ListadoClases y FormularioClase solo se preocupen de mostrar
 * datos y capturar eventos del usuario.
 *
 * @returns {{
 *   clases: Array,
 *   mensaje: {tipo: 'exito'|'error', texto: string}|null,
 *   programarClase: (datos: Object) => void,
 *   actualizarClase: (id: number, datos: Object) => void,
 *   eliminarClase: (id: number) => void,
 *   buscarClasePorId: (id: number) => Object|undefined,
 *   limpiarMensaje: () => void
 * }}
 */
export function useClases() {
  const [clases, setClases] = useState(CLASES_INICIALES);
  const [siguienteId, setSiguienteId] = useState(CLASES_INICIALES.length + 1);
  const [mensaje, setMensaje] = useState(null);

  /** Busca una clase por id. Equivale a ClaseRepositorio.consultarPorId. */
  const buscarClasePorId = useCallback(
    (id) => clases.find((clase) => clase.idClase === id),
    [clases]
  );

  /** Programa (crea) una nueva clase grupal. */
  const programarClase = useCallback(
    (datos) => {
      const nuevaClase = crearClaseGrupal(datos, siguienteId);
      setClases((actuales) => [...actuales, nuevaClase]);
      setSiguienteId((id) => id + 1);
      setMensaje({ tipo: "exito", texto: "Clase programada correctamente." });
    },
    [siguienteId]
  );

  /**
   * Actualiza una clase existente. Si el id no existe (por ejemplo, un
   * enlace desactualizado), se informa el error en lugar de fallar de
   * forma silenciosa, replicando el manejo de ClaseNoEncontradaException
   * del backend (HU-06).
   */
  const actualizarClase = useCallback(
    (id, datos) => {
      if (!buscarClasePorId(id)) {
        setMensaje({ tipo: "error", texto: `No existe una clase con id ${id}` });
        return;
      }
      setClases((actuales) =>
        actuales.map((clase) =>
          clase.idClase === id
            ? {
                ...clase,
                nombre: datos.nombre.trim(),
                entrenador: datos.entrenador.trim(),
                diaSemana: datos.diaSemana,
                horaInicio: datos.horaInicio,
                horaFin: datos.horaFin,
                cupoMaximo: Number(datos.cupoMaximo),
              }
            : clase
        )
      );
      setMensaje({ tipo: "exito", texto: "Clase actualizada correctamente." });
    },
    [buscarClasePorId]
  );

  /** Elimina una clase por id. */
  const eliminarClase = useCallback((id) => {
    setClases((actuales) => actuales.filter((clase) => clase.idClase !== id));
    setMensaje({ tipo: "exito", texto: "Clase eliminada correctamente." });
  }, []);

  const limpiarMensaje = useCallback(() => setMensaje(null), []);

  return {
    clases,
    mensaje,
    programarClase,
    actualizarClase,
    eliminarClase,
    buscarClasePorId,
    limpiarMensaje,
  };
}
