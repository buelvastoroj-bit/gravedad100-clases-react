/**
 * Ventana modal de confirmacion generica.
 *
 * Reemplaza al confirm() nativo del navegador que se usaba en el
 * prototipo HTML/JS original, ofreciendo una experiencia mas acorde a
 * la identidad visual del proyecto, pero cumpliendo la misma funcion:
 * pedir confirmacion explicita antes de una accion destructiva (HU-04,
 * eliminar clase).
 *
 * @param {{
 *   titulo: string,
 *   mensaje: string,
 *   onConfirmar: () => void,
 *   onCancelar: () => void
 * }} props
 */
export default function ModalConfirmacion({ titulo, mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay" role="presentation" onClick={onCancelar}>
      <div
        className="modal-caja"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2 id="modal-titulo" className="modal-caja__titulo">
          {titulo}
        </h2>
        <p className="modal-caja__mensaje">{mensaje}</p>
        <div className="modal-caja__acciones">
          <button type="button" className="boton boton--fantasma" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="button" className="boton boton--peligro" onClick={onConfirmar}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
