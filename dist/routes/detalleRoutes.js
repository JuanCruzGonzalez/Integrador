"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const detalleController_1 = require("../controllers/detalleController");
const router = (0, express_1.Router)();
//GET
router.get('/detalle/:id', detalleController_1.getDetallePorId);
router.get('/detalle/pedido/:idpedidoventa', detalleController_1.getDetallePorIdPedido);
//POST
router.post('/detalle/insertar/', detalleController_1.insertarDetallePedido);
//PUT
router.put('/detalle/modificar/:id', detalleController_1.modificarDetallePedido);
//DELETE
router.delete('/detalle/eliminar/:id', detalleController_1.eliminarDetallePorId);
exports.default = router;
