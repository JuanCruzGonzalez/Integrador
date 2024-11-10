"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Espera hasta que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    // Función para cargar clientes
    function cargarClientes() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('/api/clientes');
            const clientes = yield response.json();
            const clienteSelect = document.getElementById('idcliente');
            clientes.forEach((cliente) => {
                const option = document.createElement('option');
                option.value = cliente.id.toString();
                option.textContent = cliente.razonSocial;
                clienteSelect.appendChild(option);
            });
        });
    }
    // Función para cargar productos
    function cargarProductos() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('/api/productos');
            const productos = yield response.json();
            const productoSelects = document.querySelectorAll('.productoSelect');
            productoSelects.forEach(select => {
                productos.forEach((producto) => {
                    const option = document.createElement('option');
                    option.value = producto.id.toString();
                    option.textContent = producto.denominacion;
                    select.appendChild(option);
                });
            });
        });
    }
    // Función para agregar un nuevo producto al formulario
    document.getElementById('agregarProducto').addEventListener('click', function () {
        const container = document.getElementById('productosContainer');
        const nuevoProducto = document.createElement('div');
        nuevoProducto.classList.add('producto');
        nuevoProducto.innerHTML = `
            <label>Producto:</label>
            <select class="productoSelect" name="producto[]" required></select>
            <label>Cantidad:</label>
            <input type="number" class="cantidad" name="cantidad[]" required min="1">
            <button type="button" class="eliminarProducto">Eliminar</button>
        `;
        container.appendChild(nuevoProducto);
        cargarProductos(); // Cargar productos en el nuevo select
        // Agregar evento para eliminar el producto
        nuevoProducto.querySelector('.eliminarProducto').addEventListener('click', function () {
            container.removeChild(nuevoProducto);
        });
    });
    // Función para obtener el precio de un producto
    function obtenerPrecioProducto(idProducto) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`/api/productos/${idProducto}`);
            const producto = yield response.json();
            return producto.precioVenta;
        });
    }
    // Función para calcular el total del pedido
    function calcularTotalPedido() {
        return __awaiter(this, void 0, void 0, function* () {
            const productos = Array.from(document.querySelectorAll('.producto'));
            let totalPedido = 0;
            for (const producto of productos) {
                const idProducto = producto.querySelector('.productoSelect').value;
                const cantidad = parseFloat(producto.querySelector('.cantidad').value);
                if (idProducto && cantidad) {
                    const precio = yield obtenerPrecioProducto(idProducto);
                    totalPedido += precio * cantidad;
                }
            }
            return totalPedido.toFixed(2);
        });
    }
    // Enviar el formulario
    document.getElementById('pedidoForm').addEventListener('submit', function (event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault(); // Evitar el envío del formulario por defecto
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            const productos = Array.from(document.querySelectorAll('.producto')).map(producto => {
                return {
                    id: producto.querySelector('.productoSelect').value,
                    cantidad: producto.querySelector('.cantidad').value
                };
            });
            const totalPedido = yield calcularTotalPedido();
            try {
                // Enviar los datos del pedido al backend
                const response = yield fetch('/api/pedidos/insertar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        idcliente: data.idcliente,
                        fechaPedido: data.fechaPedido,
                        nroComprobante: data.nroComprobante,
                        formaPago: data.formaPago,
                        observaciones: data.observaciones,
                        totalPedido: totalPedido
                    })
                });
                const result = yield response.json();
                const mensajeDiv = document.getElementById('mensaje');
                if (response.ok) {
                    mensajeDiv.style.display = 'block';
                    mensajeDiv.textContent = result.message;
                    mensajeDiv.style.color = 'green';
                    // Insertar productos en la tabla de detalle
                    yield insertarProductos(result.pedidoId, productos);
                }
                else {
                    mensajeDiv.style.display = 'block';
                    mensajeDiv.textContent = result.error;
                    mensajeDiv.style.color = 'red';
                }
            }
            catch (error) {
                console.error('Error al crear el pedido:', error);
            }
        });
    });
    function insertarProductos(pedidoId, productos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mensajeDiv = document.getElementById('mensaje');
                mensajeDiv.style.display = 'block'; // Mostrar el mensaje de estado
                // Iterar sobre cada producto y enviarlo de uno en uno
                for (const producto of productos) {
                    const idProducto = producto.id;
                    const cantidad = producto.cantidad;
                    // Obtener el precio del producto para calcular el subtotal
                    const precio = yield obtenerPrecioProducto(idProducto);
                    const subtotal = precio * parseFloat(cantidad);
                    // Crear el objeto de datos para cada producto
                    const productoData = {
                        idpedidoventa: pedidoId,
                        idproducto: idProducto,
                        cantidad: cantidad,
                        subtotal: subtotal.toFixed(2) // Aseguramos que el subtotal esté con 2 decimales
                    };
                    // Enviar el producto al backend
                    const response = yield fetch('/api/detalle/insertar/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(productoData) // Enviar solo un producto cada vez
                    });
                    const result = yield response.json();
                    if (response.ok) {
                        mensajeDiv.textContent = `Producto insertado exitosamente: ${result.mensaje}`;
                        mensajeDiv.style.color = 'green';
                    }
                    else {
                        mensajeDiv.textContent = `Error al insertar producto: ${result.error}`;
                        mensajeDiv.style.color = 'red';
                        break; // Detener el ciclo si ocurre un error en cualquier producto
                    }
                }
            }
            catch (error) {
                console.error('Error al insertar productos:', error);
                const mensajeDiv = document.getElementById('mensaje');
                mensajeDiv.textContent = `Error al insertar productos: ${error.message}`;
                mensajeDiv.style.color = 'red';
            }
        });
    }
    // Cargar clientes y productos al cargar la página
    yield cargarClientes();
    yield cargarProductos();
}));
