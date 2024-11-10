"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteController_1 = require("../controllers/clienteController");
const router = (0, express_1.Router)();
// Ruta para obtener todos los clientes
router.get('/clientes', clienteController_1.getClientes);
// Ruta para obtener un cliente por ID
router.get('/clientes/:id', clienteController_1.getClientePorId);
exports.default = router;
