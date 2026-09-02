/**
 * Almacena el token de sesion actual en memoria (se pierde al recargar
 * la pagina, ya que la API no usa cookies). Compartido entre authApi.js
 * (que lo guarda tras un login exitoso) y clasesApi.js (que lo envia en
 * cada peticion que modifica datos).
 */

let tokenActual = null;

export function establecerToken(token) {
  tokenActual = token;
}

export function obtenerToken() {
  return tokenActual;
}

export function limpiarToken() {
  tokenActual = null;
}