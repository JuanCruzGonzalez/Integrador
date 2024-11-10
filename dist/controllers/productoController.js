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
exports.getProductoPorId = exports.getProductos = void 0;
const db_1 = __importDefault(require("../config/db"));
// Obtener todos los productos
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [productos] = yield db_1.default.query('SELECT * FROM producto');
        res.json(productos);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error });
    }
});
exports.getProductos = getProductos;
// Obtener producto por ID
const getProductoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const [producto] = yield db_1.default.query('SELECT * FROM producto WHERE id = ?', [id]);
        if (producto.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(producto[0]);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el producto', error });
    }
});
exports.getProductoPorId = getProductoPorId;
