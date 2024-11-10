export class Producto {
    id?: number;
    codigoProducto: string;
    denominacion: string;
    precioVenta: number;
  
    constructor(codigoProducto: string, denominacion: string, precioVenta: number, id?: number) {
      this.id = id;
      this.codigoProducto = codigoProducto;
      this.denominacion = denominacion;
      this.precioVenta = precioVenta;
    }
  }
  