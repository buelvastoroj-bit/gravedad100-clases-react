import { useState } from "react";
import BadgeEstadoCupo from "../BadgeEstadoCupo.jsx";
import BarraOcupacion from "../BarraOcupacion.jsx";
import {
  capitalizar, estadoCupo, iniciales, indiceDia, nombreDia, nombreDiaClase,
  normalizarTexto, ordenSemana,
} from "../../utils/formatoClases.js";
import { EncabezadoSeccion, IconoPublico, Revelar } from "./ElementosPublicos.jsx";

/**
 * Entrenadores y horarios de la pagina publica.
 * Usan las MISMAS clases que se administran en el sistema interno
 * (GET /api/clases, que no pide token). No hay datos duplicados ni inventados:
 * si se edita una clase adentro, aqui se ve el cambio.
 */

/** Agrupa las clases por entrenador: nombre, clases que dicta y cuantas. */
export function entrenadoresDesdeClases(clases) {
  const mapa = new Map();
  clases.forEach((clase) => {
    const clave = normalizarTexto(clase.entrenador);
    if (!clave) return;
    const entrenador = mapa.get(clave) ?? { nombre: capitalizar(clase.entrenador), clases: new Set(), total: 0 };
    entrenador.clases.add(capitalizar(clase.nombre));
    entrenador.total += 1;
    mapa.set(clave, entrenador);
  });
  return [...mapa.values()]
    .map((e) => ({ ...e, clases: [...e.clases] }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

function ordenarClases(a, b) {
  return (
    ordenSemana(indiceDia(a.diaSemana)) - ordenSemana(indiceDia(b.diaSemana)) ||
    String(a.horaInicio).localeCompare(String(b.horaInicio))
  );
}

function AvisoCarga() {
  return (
    <p className="pub-aviso">
      <span className="pub-aviso__disco" aria-hidden="true" />
      Cargando información actualizada del gimnasio… La primera vez puede tardar hasta un minuto.
    </p>
  );
}

export function SeccionEntrenadores({ clases, cargando }) {
  const entrenadores = entrenadoresDesdeClases(clases);

  return (
    <section id="entrenadores" className="pub-seccion pub-seccion--alterna">
      <div className="pub-contenedor">
        <EncabezadoSeccion
          etiqueta="Entrenadores"
          titulo="El equipo que te acompaña"
          descripcion="Conoce a quienes dirigen nuestras clases."
        />
        {cargando ? (
          <AvisoCarga />
        ) : entrenadores.length === 0 ? (
          <p className="pub-aviso">Pronto presentaremos a nuestro equipo de entrenadores.</p>
        ) : (
          <div className="pub-entrenadores">
            {entrenadores.map((entrenador, i) => (
              <Revelar key={entrenador.nombre} como="article" className="pub-tarjeta pub-entrenador" retraso={(i % 4) * 80}>
                <span className="pub-entrenador__foto" aria-hidden="true">{iniciales(entrenador.nombre)}</span>
                <h3>{entrenador.nombre}</h3>
                <p className="pub-entrenador__especialidad">{entrenador.clases.join(" · ")}</p>
                <p className="pub-entrenador__detalle">
                  {entrenador.total === 1 ? "1 clase a la semana" : `${entrenador.total} clases a la semana`}
                </p>
              </Revelar>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function SeccionClases({ clases, cargando, onInscribirse }) {
  const [diaElegido, setDiaElegido] = useState("todos");

  const dias = [...new Set(clases.map((c) => indiceDia(c.diaSemana)).filter((i) => i !== -1))].sort(
    (a, b) => ordenSemana(a) - ordenSemana(b)
  );
  const visibles = clases
    .filter((c) => diaElegido === "todos" || indiceDia(c.diaSemana) === Number(diaElegido))
    .sort(ordenarClases);

  return (
    <section id="clases" className="pub-seccion">
      <div className="pub-contenedor">
        <EncabezadoSeccion
          etiqueta="Clases y horarios"
          titulo="Encuentra tu clase"
          descripcion="Horarios y cupos actualizados directamente desde el sistema del gimnasio."
        />

        {cargando ? (
          <AvisoCarga />
        ) : clases.length === 0 ? (
          <p className="pub-aviso">Pronto publicaremos el horario de clases. Escríbenos para más información.</p>
        ) : (
          <>
            <div className="filtros-estado pub-dias" role="group" aria-label="Filtrar clases por día">
              <button
                type="button"
                className={`filtro-chip ${diaElegido === "todos" ? "filtro-chip--activo" : ""}`}
                aria-pressed={diaElegido === "todos"}
                onClick={() => setDiaElegido("todos")}
              >
                Toda la semana
              </button>
              {dias.map((dia) => (
                <button
                  key={dia}
                  type="button"
                  className={`filtro-chip ${String(diaElegido) === String(dia) ? "filtro-chip--activo" : ""}`}
                  aria-pressed={String(diaElegido) === String(dia)}
                  onClick={() => setDiaElegido(String(dia))}
                >
                  {nombreDia(dia)}
                </button>
              ))}
            </div>

            <div className="pub-clases">
              {visibles.map((clase) => {
                const estado = estadoCupo(clase);
                return (
                  <article key={clase.idClase} className="pub-tarjeta pub-clase">
                    <div className="pub-clase__dia">
                      <span>{nombreDiaClase(clase.diaSemana)}</span>
                      <strong>{clase.horaInicio}</strong>
                    </div>
                    <div className="pub-clase__info">
                      <div className="pub-clase__cabecera">
                        <h3>{capitalizar(clase.nombre)}</h3>
                        <BadgeEstadoCupo clase={clase} />
                      </div>
                      <p className="pub-clase__meta">
                        <IconoPublico nombre="usuario" tamano={15} /> {capitalizar(clase.entrenador)}
                        <IconoPublico nombre="reloj" tamano={15} /> {clase.horaInicio} - {clase.horaFin}
                      </p>
                      <BarraOcupacion porcentaje={estado.porcentaje} tipo={estado.tipo} />
                      <div className="pub-clase__pie">
                        <span>{estado.detalle}</span>
                        {estado.tipo !== "lleno" && (
                          <button type="button" className="enlace enlace--pequeno" onClick={onInscribirse}>
                            Quiero reservar
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
