// Barra pequena que muestra que tan llena esta una clase.
// "tipo" define el color: disponible (verde), pocos (amarillo), lleno (rojo).

export default function BarraOcupacion({ porcentaje, tipo }) {
  return (
    <div
      className="barra-ocupacion"
      role="progressbar"
      aria-label="Ocupación de la clase"
      aria-valuenow={porcentaje}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`barra-ocupacion__relleno barra-ocupacion__relleno--${tipo}`}
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  );
}
