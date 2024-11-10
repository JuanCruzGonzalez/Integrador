"use strict";
// src/pedidos.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Función para obtener y mostrar los pedidos.
function fetchPedidos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/pedidos');
            const pedidos = yield response.json();
            const tbody = document.querySelector('#pedidosTable tbody');
            if (tbody) {
                tbody.innerHTML = ''; // Limpiar el contenido anterior
                pedidos.forEach((pedido) => {
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
        }
        catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    });
}
// Llamamos a la función cuando el documento esté cargado.
document.addEventListener('DOMContentLoaded', () => {
    fetchPedidos();
});
