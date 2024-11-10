"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detalle = void 0;
class Detalle {
    constructor(producto, cantidad, id) {
        this.id = id;
        this.producto = producto;
        this.cantidad = cantidad;
    }
    calcularSubtotal() {
        this.subtotal = this.cantidad * this.producto.precioVenta;
    }
}
exports.Detalle = Detalle;
