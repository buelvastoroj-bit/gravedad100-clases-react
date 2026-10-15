// Pantalla para los modulos que aparecen en el menu pero aun no estan construidos.
// Muestra con honestidad que la funcion viene en camino, sin datos inventados.

export default function ModuloProximamente({ titulo, descripcion, Icono }) {
  return (
    <section className="proximamente">
      <div className="proximamente__icono">{Icono && <Icono />}</div>
      <span className="proximamente__etiqueta">Próximamente</span>
      <h2 className="proximamente__titulo">{titulo}</h2>
      <p className="proximamente__texto">{descripcion}</p>
    </section>
  );
}
