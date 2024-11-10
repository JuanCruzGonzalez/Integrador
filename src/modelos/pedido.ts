import { Cliente } from "./cliente.js";
import { Detalle } from "./detalle.js";

export class Pedido {
  id?: number;
  cliente: Cliente;
  detalles?: Detalle[];
  fechaPedido: Date;
  nroComprobante: number;
  formaPago: string;
  observaciones?: string;
  totalPedido: number;

  constructor(
    cliente: Cliente,
    fechaPedido: Date,
    nroComprobante: number,
    totalPedido: number,
    formaPago: string,
    observaciones?: string,
    detalles?: Detalle[],
    id?: number
  ) {
    this.id = id;
    this.cliente = cliente;
    this.detalles = detalles;
    this.fechaPedido = fechaPedido;
    this.nroComprobante = nroComprobante;
    this.formaPago = formaPago;
    this.observaciones = observaciones;
    this.totalPedido =totalPedido;
  }

  calcularTotal() {
    let resultado= 0;
    this.detalles?.forEach((detalle) => {
      detalle.calcularSubtotal();
      resultado += detalle.subtotal;
    });
    this.totalPedido = resultado;
  }
}
