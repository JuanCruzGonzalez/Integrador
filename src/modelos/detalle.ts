import { Pedido } from "./pedido.js";
import { Producto } from "./producto.js";

export class Detalle {
  id?: number;
  producto: Producto;
  cantidad: number;
  subtotal:number;
  pedido: Pedido;

  constructor(producto: Producto, cantidad: number, id?: number) {
    this.id = id;
    this.producto = producto;
    this.cantidad = cantidad;
  }

  calcularSubtotal() {
    this.subtotal= this.cantidad * this.producto.precioVenta;
  }
}
