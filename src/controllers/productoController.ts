import { Request, Response } from 'express';
import pool from '../config/db';

// Obtener todos los productos
export const getProductos = async (req: Request, res: Response) => {
    try {
        const [productos] = await pool.query('SELECT * FROM producto') as any[];
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error });
    }
};

// Obtener producto por ID
export const getProductoPorId = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const [producto] = await pool.query('SELECT * FROM producto WHERE id = ?', [id]) as any[];
        if (producto.length === 0) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }
        res.json(producto[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el producto', error });
    }
};
