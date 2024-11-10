"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
class Producto {
    constructor(codigoProducto, denominacion, precioVenta, id) {
        this.id = id;
        this.codigoProducto = codigoProducto;
        this.denominacion = denominacion;
        this.precioVenta = precioVenta;
    }
}
exports.Producto = Producto;
