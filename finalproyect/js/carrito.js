import { guardarEnLocalStorage, obtenerDeLocalStorage } from "./utils.js";

let carrito = obtenerDeLocalStorage("carrito");

export function obtenerCarrito() {
  return carrito;
}

export function guardarCarrito() {
  guardarEnLocalStorage("carrito", carrito);
}

export function agregarAlCarrito(producto) {
  const productoEnCarrito = carrito.find(item => item.id === producto.id);

  if (productoEnCarrito) {
    if (productoEnCarrito.cantidad < producto.stock) {
      productoEnCarrito.cantidad++;
    } else {
      Swal.fire({
        icon: "warning",
        title: "Stock máximo alcanzado",
        text: `No podés agregar más de ${producto.stock} unidades de este producto`
      });
      return;
    }
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }

  guardarCarrito();
}

export function eliminarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  guardarCarrito();
}

export function aumentarCantidad(id) {
  const producto = carrito.find(item => item.id === id);

  if (producto) {
    if (producto.cantidad < producto.stock) {
      producto.cantidad++;
      guardarCarrito();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Stock máximo alcanzado",
        text: `Solo hay ${producto.stock} unidades disponibles`
      });
    }
  }
}

export function disminuirCantidad(id) {
  const producto = carrito.find(item => item.id === id);

  if (producto) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    } else {
      carrito = carrito.filter(item => item.id !== id);
    }

    guardarCarrito();
  }
}

export function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
}

export function calcularSubtotal() {
  return carrito.reduce((acumulador, item) => {
    return acumulador + (item.precio * item.cantidad);
  }, 0);
}

export function calcularEnvio() {
  const tipoEnvio = document.getElementById("tipo-envio");

  if (!tipoEnvio) {
    return 0;
  }

  return tipoEnvio.value === "domicilio" ? 5000 : 0;
}

export function calcularTotal() {
  return calcularSubtotal() + calcularEnvio();
}

export function cantidadTotalProductos() {
  return carrito.reduce((acumulador, item) => {
    return acumulador + item.cantidad;
  }, 0);
}