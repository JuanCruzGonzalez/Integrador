// src/pedidos.ts

// Definimos una interfaz para los pedidos para facilitar el tipado.
interface Pedido {
    id: number;
    idcliente: string;
    fechaPedido: string;
    nroComprobante: string;
    formaPago: string;
    totalPedido: number;
}

// Función para obtener y mostrar los pedidos.
async function fetchPedidos(): Promise<void> {
    try {
        const response = await fetch('/api/pedidos');
        const pedidos: Pedido[] = await response.json();

        const tbody = document.querySelector<HTMLTableSectionElement>('#pedidosTable tbody');
        if (tbody) {
            tbody.innerHTML = ''; // Limpiar el contenido anterior

            pedidos.forEach((pedido: Pedido) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pedido.id}</td>
                    <td>${pedido.idcliente}</td>
                    <td>${pedido.fechaPedido}</td>
                    <td>${pedido.nroComprobante}</td>
                    <td>${pedido.formaPago}</td>
                    <td>${pedido.totalPedido}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
    }
}

// Llamamos a la función cuando el documento esté cargado.
document.addEventListener('DOMContentLoaded', () => {
    fetchPedidos();
});
