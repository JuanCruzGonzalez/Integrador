"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedido = void 0;
class Pedido {
    constructor(cliente, fechaPedido, nroComprobante, totalPedido, formaPago, observaciones, detalles, id) {
        this.id = id;
        this.cliente = cliente;
        this.detalles = detalles;
        this.fechaPedido = fechaPedido;
        this.nroComprobante = nroComprobante;
        this.formaPago = formaPago;
        this.observaciones = observaciones;
        this.totalPedido = totalPedido;
    }
    calcularTotal() {
        var _a;
        let resultado = 0;
        (_a = this.detalles) === null || _a === void 0 ? void 0 : _a.forEach((detalle) => {
            detalle.calcularSubtotal();
            resultado += detalle.subtotal;
        });
        this.totalPedido = resultado;
    }
}
exports.Pedido = Pedido;
