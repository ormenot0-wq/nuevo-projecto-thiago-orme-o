export async function cargarProductos() {
  const respuesta = await fetch("./data/productos.json");
  const productos = await respuesta.json();
  return productos;
}

export function filtrarPorCategoria(productos, categoria) {
  if (categoria === "todos") {
    return productos;
  }

  return productos.filter(producto => producto.categoria === categoria);
}

export function buscarProductos(productos, textoBuscado) {
  const texto = textoBuscado.toLowerCase().trim();

  return productos.filter(producto =>
    producto.nombre.toLowerCase().includes(texto)
  );
}

export function ordenarProductos(productos, orden) {
  const copiaProductos = [...productos];

  if (orden === "menor-mayor") {
    copiaProductos.sort((a, b) => a.precio - b.precio);
  } else if (orden === "mayor-menor") {
    copiaProductos.sort((a, b) => b.precio - a.precio);
  }

  return copiaProductos;
}

export function aplicarFiltros(productos, categoria, textoBuscado, orden) {
  let resultado = [...productos];

  resultado = filtrarPorCategoria(resultado, categoria);

  if (textoBuscado.trim() !== "") {
    resultado = buscarProductos(resultado, textoBuscado);
  }

  resultado = ordenarProductos(resultado, orden);

  return resultado;
}