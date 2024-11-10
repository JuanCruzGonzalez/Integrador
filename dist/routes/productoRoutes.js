"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoController_1 = require("../controllers/productoController");
const router = (0, express_1.Router)();
// Ruta para obtener todos los productos
router.get('/productos', productoController_1.getProductos);
// Ruta para obtener un producto por ID
router.get('/productos/:id', productoController_1.getProductoPorId);
exports.default = router;
