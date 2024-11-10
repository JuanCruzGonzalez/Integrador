import { Router } from 'express';
import { getClientes, getClientePorId } from '../controllers/clienteController';

const router = Router();

// Ruta para obtener todos los clientes
router.get('/clientes', getClientes);

// Ruta para obtener un cliente por ID
router.get('/clientes/:id', getClientePorId as any);

export default router;
