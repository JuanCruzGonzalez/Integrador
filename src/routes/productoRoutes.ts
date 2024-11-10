import { Router } from 'express';
import { getProductos, getProductoPorId } from '../controllers/productoController';

const router = Router();

// Ruta para obtener todos los productos
router.get('/productos', getProductos);

// Ruta para obtener un producto por ID
router.get('/productos/:id', getProductoPorId as any);

export default router;
