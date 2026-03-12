import { formatearPrecio } from "./utils.js";
import {
  obtenerCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  aumentarCantidad,
  disminuirCantidad,
  vaciarCarrito,
  calcularSubtotal,
  calcularEnvio,
  calcularTotal,
  cantidadTotalProductos
} from "./carrito.js";

export function renderizarProductos(productos) {
  const contenedorProductos = document.getElementById("contenedor-productos");
  contenedorProductos.innerHTML = "";

  if (productos.length === 0) {
    contenedorProductos.innerHTML = `
      <p>No se encontraron productos.</p>
    `;
    return;
  }

  productos.forEach(producto => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "producto";

    tarjeta.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <p><strong>Categoría:</strong> ${producto.categoria}</p>
      <p><strong>Precio:</strong> $${formatearPrecio(producto.precio)}</p>
      <p><strong>Stock:</strong> ${producto.stock}</p>
      <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
    `;

    contenedorProductos.appendChild(tarjeta);
  });
}

export function activarBotonesAgregar(productos) {
  const botonesAgregar = document.querySelectorAll(".btn-agregar");

  botonesAgregar.forEach(boton => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      const productoSeleccionado = productos.find(producto => producto.id === id);

      if (productoSeleccionado) {
        agregarAlCarrito(productoSeleccionado);
        renderizarCarrito();
        actualizarContadorCarrito();

        Swal.fire({
          icon: "success",
          title: "Producto agregado",
          text: `${productoSeleccionado.nombre} fue agregado al carrito`,
          timer: 1200,
          showConfirmButton: false
        });
      }
    });
  });
}

export function renderizarCarrito() {
  const contenedorCarrito = document.getElementById("contenedor-carrito");
  const subtotalHTML = document.getElementById("subtotal");
  const envioHTML = document.getElementById("envio");
  const totalHTML = document.getElementById("total");

  const carrito = obtenerCarrito();

  contenedorCarrito.innerHTML = "";

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío.</p>`;
  } else {
    carrito.forEach(item => {
      const div = document.createElement("div");
      div.className = "item-carrito";

      div.innerHTML = `
        <h4>${item.nombre}</h4>
        <p>Precio: $${formatearPrecio(item.precio)}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <p>Subtotal: $${formatearPrecio(item.precio * item.cantidad)}</p>
        <button class="btn-disminuir" data-id="${item.id}">-</button>
        <button class="btn-aumentar" data-id="${item.id}">+</button>
        <button class="btn-eliminar" data-id="${item.id}">Eliminar</button>
      `;

      contenedorCarrito.appendChild(div);
    });
  }

  subtotalHTML.textContent = formatearPrecio(calcularSubtotal());
  envioHTML.textContent = formatearPrecio(calcularEnvio());
  totalHTML.textContent = formatearPrecio(calcularTotal());

  activarBotonesCarrito();
}

export function activarBotonesCarrito() {
  const botonesAumentar = document.querySelectorAll(".btn-aumentar");
  const botonesDisminuir = document.querySelectorAll(".btn-disminuir");
  const botonesEliminar = document.querySelectorAll(".btn-eliminar");
  const botonVaciar = document.getElementById("btn-vaciar-carrito");

  botonesAumentar.forEach(boton => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      aumentarCantidad(id);
      renderizarCarrito();
      actualizarContadorCarrito();
    });
  });

  botonesDisminuir.forEach(boton => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      disminuirCantidad(id);
      renderizarCarrito();
      actualizarContadorCarrito();
    });
  });

  botonesEliminar.forEach(boton => {
    boton.addEventListener("click", () => {
      const id = Number(boton.dataset.id);
      eliminarDelCarrito(id);
      renderizarCarrito();
      actualizarContadorCarrito();
    });
  });

  if (botonVaciar) {
    botonVaciar.onclick = () => {
      const carrito = obtenerCarrito();

      if (carrito.length === 0) {
        Swal.fire({
          icon: "info",
          title: "El carrito ya está vacío"
        });
        return;
      }

      Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Se eliminarán todos los productos",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
      }).then(resultado => {
        if (resultado.isConfirmed) {
          vaciarCarrito();
          renderizarCarrito();
          actualizarContadorCarrito();

          Swal.fire({
            icon: "success",
            title: "Carrito vaciado",
            timer: 1000,
            showConfirmButton: false
          });
        }
      });
    };
  }
}

export function actualizarContadorCarrito() {
  const contador = document.getElementById("contador-carrito");
  contador.textContent = cantidadTotalProductos();
}