"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cliente = void 0;
class Cliente {
    constructor(cuit, razonSocial, id) {
        this.id = id;
        this.cuit = cuit;
        this.razonSocial = razonSocial;
    }
}
exports.Cliente = Cliente;
