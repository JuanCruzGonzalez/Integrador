import { Pedido } from "./pedido.js";

export class Cliente {
    id?: number;
    cuit: string;
    razonSocial: string;
    pedidos?: Pedido[];
  
    constructor(cuit: string, razonSocial: string, id?: number) {
      this.id = id;
      this.cuit = cuit;
      this.razonSocial = razonSocial;
    }
  }
  