// Espera hasta que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', async () => {
    // Función para cargar clientes
    async function cargarClientes() {
        const response = await fetch('/api/clientes');
        const clientes = await response.json();
        const clienteSelect = document.getElementById('idcliente') as HTMLSelectElement;

        clientes.forEach((cliente: { id: { toString: () => string; }; razonSocial: string | null; }) => {
            const option = document.createElement('option');
            option.value = cliente.id.toString();
            option.textContent = cliente.razonSocial;
            clienteSelect.appendChild(option);
        });
    }

    // Función para cargar productos
    async function cargarProductos() {
        const response = await fetch('/api/productos');
        const productos = await response.json();
        const productoSelects = document.querySelectorAll('.productoSelect') as NodeListOf<HTMLSelectElement>;

        productoSelects.forEach(select => {
            productos.forEach((producto: { id: { toString: () => string; }; denominacion: string | null; }) => {
                const option = document.createElement('option');
                option.value = producto.id.toString();
                option.textContent = producto.denominacion;
                select.appendChild(option);
            });
        });
    }

    // Función para agregar un nuevo producto al formulario
    document.getElementById('agregarProducto')!.addEventListener('click', function() {
        const container = document.getElementById('productosContainer')!;
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
        nuevoProducto.querySelector('.eliminarProducto')!.addEventListener('click', function() {
            container.removeChild(nuevoProducto);
        });
    });

    // Función para obtener el precio de un producto
    async function obtenerPrecioProducto(idProducto: string) {
        const response = await fetch(`/api/productos/${idProducto}`);
        const producto = await response.json();
        return producto.precioVenta;
    }

    // Función para calcular el total del pedido
    async function calcularTotalPedido(): Promise<string> {
        const productos = Array.from(document.querySelectorAll('.producto')) as HTMLElement[];
        let totalPedido = 0;

        for (const producto of productos) {
            const idProducto = (producto.querySelector('.productoSelect') as HTMLSelectElement).value;
            const cantidad = parseFloat((producto.querySelector('.cantidad') as HTMLInputElement).value);

            if (idProducto && cantidad) {
                const precio = await obtenerPrecioProducto(idProducto);
                totalPedido += precio * cantidad;
            }
        }

        return totalPedido.toFixed(2);
    }

    // Enviar el formulario
    document.getElementById('pedidoForm')!.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        const formData = new FormData(this as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        const productos = Array.from(document.querySelectorAll('.producto')).map(producto => {
            return {
                id: (producto.querySelector('.productoSelect') as HTMLSelectElement).value,
                cantidad: (producto.querySelector('.cantidad') as HTMLInputElement).value
            };
        });
        const totalPedido = await calcularTotalPedido();

        try {
            // Enviar los datos del pedido al backend
            const response = await fetch('/api/pedidos/insertar', {
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

            const result = await response.json();
            const mensajeDiv = document.getElementById('mensaje')!;

            if (response.ok) {
                mensajeDiv.style.display = 'block';
                mensajeDiv.textContent = result.message;
                mensajeDiv.style.color = 'green';

                // Insertar productos en la tabla de detalle
                await insertarProductos(result.pedidoId, productos);
            } else {
                mensajeDiv.style.display = 'block';
                mensajeDiv.textContent = result.error;
                mensajeDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error al crear el pedido:', error);
        }
    });

    // Función para insertar productos en la tabla de detalle
    // Definir las interfaces para los datos que estamos manejando
    interface Producto {
        id: string;
        cantidad: string;
    }

    async function insertarProductos(pedidoId: number, productos: Producto[]): Promise<void> {
        try {
            const mensajeDiv = document.getElementById('mensaje') as HTMLElement;
            mensajeDiv.style.display = 'block'; // Mostrar el mensaje de estado

            // Iterar sobre cada producto y enviarlo de uno en uno
            for (const producto of productos) {
                const idProducto = producto.id;
                const cantidad = producto.cantidad;
                
                // Obtener el precio del producto para calcular el subtotal
                const precio = await obtenerPrecioProducto(idProducto);
                const subtotal = precio * parseFloat(cantidad);

                // Crear el objeto de datos para cada producto
                const productoData = {
                    idpedidoventa: pedidoId,
                    idproducto: idProducto,
                    cantidad: cantidad,
                    subtotal: subtotal.toFixed(2)  // Aseguramos que el subtotal esté con 2 decimales
                };

                // Enviar el producto al backend
                const response = await fetch('/api/detalle/insertar/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productoData)  // Enviar solo un producto cada vez
                });

                const result = await response.json();

                if (response.ok) {
                    mensajeDiv.textContent = `Producto insertado exitosamente: ${result.mensaje}`;
                    mensajeDiv.style.color = 'green';
                } else {
                    mensajeDiv.textContent = `Error al insertar producto: ${result.error}`;
                    mensajeDiv.style.color = 'red';
                    break;  // Detener el ciclo si ocurre un error en cualquier producto
                }
            }
        } catch (error: any) {
            console.error('Error al insertar productos:', error);
            const mensajeDiv = document.getElementById('mensaje') as HTMLElement;
            mensajeDiv.textContent = `Error al insertar productos: ${error.message}`;
            mensajeDiv.style.color = 'red';
        }
    }

    // Cargar clientes y productos al cargar la página
    await cargarClientes();
    await cargarProductos();
});
