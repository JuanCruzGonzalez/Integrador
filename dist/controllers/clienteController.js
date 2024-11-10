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
exports.getClientePorId = exports.getClientes = void 0;
const db_1 = __importDefault(require("../config/db"));
// Obtener todos los clientes
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [clientes] = yield db_1.default.query('SELECT * FROM cliente');
        res.json(clientes);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los clientes', error });
    }
});
exports.getClientes = getClientes;
// Obtener cliente por ID
const getClientePorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const [cliente] = yield db_1.default.query('SELECT * FROM cliente WHERE id = ?', [id]);
        if (cliente.length === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json(cliente[0]);
    }
    catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el cliente', error });
    }
});
exports.getClientePorId = getClientePorId;
