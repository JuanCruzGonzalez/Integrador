"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarDetallePorId = exports.modificarDetallePedido = exports.insertarDetallePedido = exports.getDetallePorIdPedido = exports.getDetallePorId = void 0;
const db_1 = __importDefault(require("../config/db"));
// Metodos GET
// Obtener detalle por Id
const getDetallePorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const [detalle] = yield db_1.default.query('SELECT * FROM pedido_venta_detalle WHERE id = ?', [id]);
        if (detalle.length === 0) {
            return res.status(404).json({ mensaje: 'Detalle no encontrado' });
        }
        res.json(detalle[0]);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el detalle', error });
    }
});
exports.getDetallePorId = getDetallePorId;
// Obtener detalles por Id de pedido
const getDetallePorIdPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idPedidoVenta = parseInt(req.params.idpedidoventa);
    try {
        const [detalles] = yield db_1.default.query('SELECT * FROM pedido_venta_detalle WHERE idpedidoventa = ?', [idPedidoVenta]);
        if (detalles.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron detalles para el pedido especificado' });
        }
        res.json(detalles);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los detalles', error });
    }
});
exports.getDetallePorIdPedido = getDetallePorIdPedido;
//POST
const insertarDetallePedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idpedidoventa, idproducto, cantidad, subtotal } = req.body;
    try {
        const [result] = yield db_1.default.query('INSERT INTO pedido_venta_detalle (idpedidoventa, idproducto, cantidad, subtotal) VALUES (?, ?, ?, ?)', [idpedidoventa, idproducto, cantidad, subtotal]);
        res.status(201).json({ mensaje: 'Detalle agregado exitosamente', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar el detalle', error });
    }
});
exports.insertarDetallePedido = insertarDetallePedido;
//PUT
//El metodo de modificar solo modifica la cantidad y el subtotal. se los debemos pasar ya calculados
const modificarDetallePedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { cantidad, subtotal } = req.body;
    try {
        const [result] = yield db_1.default.query('UPDATE pedido_venta_detalle SET cantidad = ?, subtotal = ? WHERE id = ?', [cantidad, subtotal, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Detalle no encontrado' });
        }
        res.json({ mensaje: 'Detalle actualizado exitosamente' });
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el detalle', error });
    }
});
exports.modificarDetallePedido = modificarDetallePedido;
// Metodo DELETE
const eliminarDetallePorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const [result] = yield db_1.default.query('DELETE FROM pedido_venta_detalle WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Detalle no encontrado' });
        }
        res.json({ mensaje: 'Detalle eliminado exitosamente' });
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el detalle', error });
    }
});
exports.eliminarDetallePorId = eliminarDetallePorId;
