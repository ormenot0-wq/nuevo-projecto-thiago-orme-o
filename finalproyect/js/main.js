import { cargarProductos, aplicarFiltros } from "./productos.js";
import {
  renderizarProductos,
  activarBotonesAgregar,
  renderizarCarrito,
  actualizarContadorCarrito
} from "./ui.js";
import { obtenerCarrito, vaciarCarrito, calcularTotal } from "./carrito.js";

let listaProductos = [];

async function iniciarApp() {
  try {
    listaProductos = await cargarProductos();

    renderizarProductos(listaProductos);
    activarBotonesAgregar(listaProductos);
    renderizarCarrito();
    actualizarContadorCarrito();

    configurarFiltros();
    configurarCheckout();
    configurarCambioEnvio();
  } catch (error) {
    console.error("Error al cargar los productos:", error);

    const contenedorProductos = document.getElementById("contenedor-productos");
    contenedorProductos.innerHTML = `<p>Error al cargar los productos.</p>`;
  }
}

function configurarFiltros() {
  const buscador = document.getElementById("buscador");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const ordenPrecio = document.getElementById("orden-precio");
  const btnResetFiltros = document.getElementById("btn-reset-filtros");

  function actualizarVista() {
    const categoriaSeleccionada = filtroCategoria.value;
    const textoBuscado = buscador.value;
    const ordenSeleccionado = ordenPrecio.value;

    const productosFiltrados = aplicarFiltros(
      listaProductos,
      categoriaSeleccionada,
      textoBuscado,
      ordenSeleccionado
    );

    renderizarProductos(productosFiltrados);
    activarBotonesAgregar(listaProductos);
  }

  buscador.addEventListener("input", actualizarVista);
  filtroCategoria.addEventListener("change", actualizarVista);
  ordenPrecio.addEventListener("change", actualizarVista);

  btnResetFiltros.addEventListener("click", () => {
    buscador.value = "";
    filtroCategoria.value = "todos";
    ordenPrecio.value = "default";

    renderizarProductos(listaProductos);
    activarBotonesAgregar(listaProductos);
  });
}

function configurarCambioEnvio() {
  const tipoEnvio = document.getElementById("tipo-envio");

  tipoEnvio.addEventListener("change", () => {
    renderizarCarrito();
  });
}

function configurarCheckout() {
  const formulario = document.getElementById("form-checkout");

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "Debés agregar productos antes de finalizar la compra"
      });
      return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const pago = document.getElementById("pago").value;
    const tipoEnvio = document.getElementById("tipo-envio").value;

    if (nombre === "" || email === "" || direccion === "") {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completá todos los campos"
      });
      return;
    }

    const totalCompra = calcularTotal();

    Swal.fire({
      icon: "success",
      title: "Compra realizada con éxito",
      html: `
        <p><strong>Cliente:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        <p><strong>Método de pago:</strong> ${pago}</p>
        <p><strong>Tipo de envío:</strong> ${tipoEnvio}</p>
        <p><strong>Total abonado:</strong> $${totalCompra.toLocaleString("es-AR")}</p>
      `
    });

    vaciarCarrito();
    renderizarCarrito();
    actualizarContadorCarrito();

    formulario.reset();
document.getElementById("nombre").value = "Agustin Nicolas Ormeno";
document.getElementById("email").value = "agustin@email.com";
document.getElementById("direccion").value = "Av. siempreviva lo que sea";
document.getElementById("pago").value = "tarjeta";
document.getElementById("tipo-envio").value = "retiro";
  });
}

iniciarApp();