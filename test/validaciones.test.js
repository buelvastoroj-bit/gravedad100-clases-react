import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { validarClase, esValido } from "../src/utils/validaciones.js";

/**
 * Pruebas unitarias del modulo de validaciones del formulario de clases
 * (componente React, evidencia AA4_EV03 / GA8_AA1_EV01).
 *
 * Ejecutar con: node --test
 */

describe("validarClase (React)", () => {
  const datosValidos = {
    nombre: "Spinning",
    entrenador: "Carlos Perez",
    diaSemana: "Lunes",
    horaInicio: "06:00",
    horaFin: "07:00",
    cupoMaximo: 15,
  };

  test("acepta datos completamente validos", () => {
    const errores = validarClase(datosValidos);
    assert.deepEqual(errores, {});
    assert.equal(esValido(errores), true);
  });

  test("rechaza nombre vacio", () => {
    const errores = validarClase({ ...datosValidos, nombre: "" });
    assert.ok(errores.nombre);
  });

  test("rechaza nombre de mas de 60 caracteres", () => {
    const errores = validarClase({ ...datosValidos, nombre: "x".repeat(61) });
    assert.ok(errores.nombre);
  });

  test("rechaza entrenador de mas de 100 caracteres", () => {
    const errores = validarClase({ ...datosValidos, entrenador: "x".repeat(101) });
    assert.ok(errores.entrenador);
  });

  test("rechaza cupo maximo igual a cero (bug conocido de JS con valores falsy)", () => {
    const errores = validarClase({ ...datosValidos, cupoMaximo: 0 });
    assert.equal(errores.cupoMaximo, "El cupo maximo debe ser mayor que cero.");
  });

  test("distingue cupo vacio de cupo en cero", () => {
    const errores = validarClase({ ...datosValidos, cupoMaximo: "" });
    assert.equal(errores.cupoMaximo, "El cupo maximo es obligatorio.");
  });

  test("rechaza hora fin anterior o igual a hora inicio", () => {
    const errores = validarClase({ ...datosValidos, horaInicio: "18:00", horaFin: "06:00" });
    assert.ok(errores.horaFin);
  });

  test("acumula varios errores a la vez cuando el formulario esta vacio", () => {
    const errores = validarClase({});
    assert.ok(Object.keys(errores).length >= 5);
    assert.equal(esValido(errores), false);
  });
});
