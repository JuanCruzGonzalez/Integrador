import { Request, Response } from 'express';
import pool from '../config/db';

// Obtener todos los clientes
export const getClientes = async (req: Request, res: Response) => {
    try {
        const [clientes] = await pool.query('SELECT * FROM cliente') as any[];
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los clientes', error });
    }
};

// Obtener cliente por ID
export const getClientePorId = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const [cliente] = await pool.query('SELECT * FROM cliente WHERE id = ?', [id]) as any[];
        if (cliente.length === 0) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }
        res.json(cliente[0]);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el cliente', error });
    }
};
