import { Request, Response } from 'express';
import pool from '../config/db';

// Metodos GET
// Obtener detalle por Id
export const getDetallePorId = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const [detalle] = await pool.query('SELECT * FROM pedido_venta_detalle WHERE id = ?', [id]) as any[];
        if (detalle.length === 0) {
            return res.status(404).json({ mensaje: 'Detalle no encontrado' });
        }
        res.json(detalle[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el detalle', error });
    }
};

// Obtener detalles por Id de pedido
export const getDetallePorIdPedido = async (req: Request, res: Response) => {
    const idPedidoVenta = parseInt(req.params.idpedidoventa);
    try {
        const [detalles] = await pool.query('SELECT * FROM pedido_venta_detalle WHERE idpedidoventa = ?', [idPedidoVenta]) as any[];
        if (detalles.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron detalles para el pedido especificado' });
        }
        res.json(detalles);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los detalles', error });
    }
};

//POST

export const insertarDetallePedido = async (req: Request, res: Response) => {
    const { idpedidoventa, idproducto, cantidad, subtotal } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO pedido_venta_detalle (idpedidoventa, idproducto, cantidad, subtotal) VALUES (?, ?, ?, ?)',
            [idpedidoventa, idproducto, cantidad, subtotal]
        ) as any[];
        res.status(201).json({ mensaje: 'Detalle agregado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar el detalle', error });
    }
};

//PUT
//El metodo de modificar solo modifica la cantidad y el subtotal. se los debemos pasar ya calculados
export const modificarDetallePedido = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { cantidad, subtotal } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE pedido_venta_detalle SET cantidad = ?, subtotal = ? WHERE id = ?',
            [cantidad, subtotal, id]
        ) as any[];

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Detalle no encontrado' });
        }

        res.json({ mensaje: 'Detalle actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el detalle', error });
    }
};

// Metodo DELETE

export const eliminarDetallePorId = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const [result] = await pool.query(
            'DELETE FROM pedido_venta_detalle WHERE id = ?',
            [id]
        ) as any[];

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Detalle no encontrado' });
        }

        res.json({ mensaje: 'Detalle eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el detalle', error });
    }
};