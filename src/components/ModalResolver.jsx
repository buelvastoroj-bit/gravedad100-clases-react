import { useState } from "react";

/**
 * Modal para escribir la respuesta y marcar una solicitud como resuelta.
 *
 * @param {{
 *   solicitud: Object,
 *   onConfirmar: (respuesta: string) => void,
 *   onCancelar: () => void
 * }} props
 */
export default function ModalResolver({ solicitud, onConfirmar, onCancelar }) {
  const [respuesta, setRespuesta] = useState("");

  function manejarConfirmar() {
    if (respuesta.trim()) onConfirmar(respuesta.trim());
  }

  return (
    <div className="modal-overlay">
      <div className="modal-caja">
        <h3 className="modal-caja__titulo">Resolver solicitud</h3>
        <p className="modal-caja__mensaje">
          <strong>{solicitud.asunto}</strong> — {solicitud.descripcion}
        </p>
        <div className="campo">
          <label htmlFor="respuesta">Respuesta *</label>
          <input
            id="respuesta"
            type="text"
            autoFocus
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
          />
        </div>
        <div className="modal-caja__acciones">
          <button type="button" className="boton boton--fantasma" onClick={onCancelar}>Cancelar</button>
          <button type="button" className="boton boton--primario" onClick={manejarConfirmar}>
            Marcar como resuelta
          </button>
        </div>
      </div>
    </div>
  );
}