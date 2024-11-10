import { Router } from 'express';
import { getPedidos, getPedidoPorId, getPedidosPorFechas, getPedidoPorComprobante, eliminarPedido, insertarPedido, modificarPedido, generarPdfPorId } from '../controllers/pedidoController';

const router = Router();

// Metodos GET
router.get('/pedidos', getPedidos);                         
router.get('/pedidos/:id', getPedidoPorId as any); // ejemplo de uso de id http://localhost:3000/api/pedidos/2
router.get('/pedidos/comprobante/:nroComprobante', getPedidoPorComprobante); // ejemplo de uso de id http://localhost:3000/api/pedidos/comprobantete/1002
router.get('/pedidosXfecha', getPedidosPorFechas as any);
// ejemplo de uso de  fechas http://localhost:3000/api/pedidosXFecha?fechaInicio=2023-01-01&fechaFin=2024-11-09
router.get('/pedidos/generarPDF/:id', generarPdfPorId as any ); //genera el PDF

// Metodos POST PUT y DELETE
router.post('/pedidos/insertar/', insertarPedido as any);
router.put('/pedidos/modificar/:id', modificarPedido as any);// ejemplo de uso de id http://localhost:3000/api/pedidos/modificar/2
router.delete('/pedidos/eliminar/:id', eliminarPedido as any);// ejemplo de uso de id http://localhost:3000/api/pedidos/eliminar/2

export default router;
