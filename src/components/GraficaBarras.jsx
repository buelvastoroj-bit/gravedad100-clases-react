/**
 * Grafica de barras verticales hecha solo con CSS (sin librerias).
 * La barra con el valor mas alto se resalta en naranja.
 *
 * @param {{
 *   datos: Array<{etiqueta: string, valor: number}>,
 *   textoVacio?: string
 * }} props
 */
export default function GraficaBarras({ datos, textoVacio = "Aún no hay datos para mostrar." }) {
  const maximo = Math.max(0, ...datos.map((dato) => dato.valor));

  if (maximo === 0) {
    return <p className="grafica-vacia">{textoVacio}</p>;
  }

  const descripcion = datos.map((dato) => `${dato.etiqueta}: ${dato.valor}`).join(", ");

  return (
    <div className="grafica-barras" role="img" aria-label={descripcion}>
      {datos.map((dato) => (
        <div key={dato.etiqueta} className="grafica-barras__columna">
          <span className="grafica-barras__valor">{dato.valor > 0 ? dato.valor : ""}</span>
          <div className="grafica-barras__pista">
            <div
              className={`grafica-barras__barra ${dato.valor === maximo ? "grafica-barras__barra--maxima" : ""}`}
              style={{ height: `${(dato.valor / maximo) * 100}%` }}
            />
          </div>
          <span className="grafica-barras__etiqueta">{dato.etiqueta}</span>
        </div>
      ))}
    </div>
  );
}
