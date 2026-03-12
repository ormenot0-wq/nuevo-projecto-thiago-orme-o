export function formatearPrecio(precio) {
  return precio.toLocaleString("es-AR");
}

export function guardarEnLocalStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function obtenerDeLocalStorage(clave) {
  const datoGuardado = localStorage.getItem(clave);

  if (datoGuardado) {
    return JSON.parse(datoGuardado);
  }

  return [];
}