"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedidoController_1 = require("../controllers/pedidoController");
const router = (0, express_1.Router)();
// Metodos GET
router.get('/pedidos', pedidoController_1.getPedidos);
router.get('/pedidos/:id', pedidoController_1.getPedidoPorId); // ejemplo de uso de id http://localhost:3000/api/pedidos/2
router.get('/pedidos/comprobante/:nroComprobante', pedidoController_1.getPedidoPorComprobante); // ejemplo de uso de id http://localhost:3000/api/pedidos/comprobantete/1002
router.get('/pedidosXfecha', pedidoController_1.getPedidosPorFechas);
// ejemplo de uso de  fechas http://localhost:3000/api/pedidosXFecha?fechaInicio=2023-01-01&fechaFin=2024-11-09
router.get('/pedidos/generarPDF/:id', pedidoController_1.generarPdfPorId); //genera el PDF
// Metodos POST PUT y DELETE
router.post('/pedidos/insertar/', pedidoController_1.insertarPedido);
router.put('/pedidos/modificar/:id', pedidoController_1.modificarPedido); // ejemplo de uso de id http://localhost:3000/api/pedidos/modificar/2
router.delete('/pedidos/eliminar/:id', pedidoController_1.eliminarPedido); // ejemplo de uso de id http://localhost:3000/api/pedidos/eliminar/2
exports.default = router;
