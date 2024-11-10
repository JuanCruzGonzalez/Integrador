import { Router } from 'express';
import { eliminarDetallePorId, getDetallePorId, getDetallePorIdPedido, insertarDetallePedido, modificarDetallePedido } from '../controllers/detalleController';

const router = Router();

//GET
router.get('/detalle/:id', getDetallePorId as any);
router.get('/detalle/pedido/:idpedidoventa', getDetallePorIdPedido as any);
//POST
router.post('/detalle/insertar/', insertarDetallePedido);
//PUT
router.put('/detalle/modificar/:id', modificarDetallePedido as any);
//DELETE
router.delete('/detalle/eliminar/:id', eliminarDetallePorId as any);

export default router;
