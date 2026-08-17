/**
 * Muestra un mensaje de exito o error tras una operacion sobre una clase
 * (crear, editar, eliminar, o el caso de clase no encontrada de HU-06).
 *
 * @param {{mensaje: {tipo: 'exito'|'error', texto: string}}} props
 */
export default function MensajeAlerta({ mensaje }) {
  if (!mensaje) return null;

  return (
    <div className={`alerta alerta--${mensaje.tipo}`} role="status">
      {mensaje.texto}
    </div>
  );
}
