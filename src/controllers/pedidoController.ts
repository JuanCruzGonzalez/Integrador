import { Request, Response } from 'express';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import PDFDocument from 'pdfkit-table';

// Metodos GET

export const getPedidos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pedido_venta') as any[];
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

export const getPedidoPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`Buscando pedido con id ${id}`);
  try {
    const [rows] = await pool.query('SELECT * FROM pedido_venta WHERE id = ?', [id]) as any[];
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
};

export const getPedidoPorComprobante = async (req: Request, res: Response) => {
  const nroComprobante = parseInt(req.params.nroComprobante, 10);
  console.log(`Buscando pedido con nroComprobante ${nroComprobante}`);
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM pedido_venta WHERE nroComprobante = ?',
      [nroComprobante]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Pedido no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
};

export const getPedidosPorFechas = async (req: Request, res: Response) => {
  const { fechaInicio, fechaFin } = req.query;

  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ error: 'Faltan parámetros fechaInicio o fechaFin' });
  }

  const start = new Date(fechaInicio as string);
  const end = new Date(fechaFin as string);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Fechas inválidas' });
  }

  console.log(`Buscando pedidos entre ${start.toISOString()} y ${end.toISOString()}`);

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM pedido_venta WHERE fechaPedido BETWEEN ? AND ?',
      [start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ error: 'No se encontraron pedidos en el rango de fechas especificado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

//Metodo POST (Para insertar un pedido la logica y datos van a ser realizados en el front y nosotros recibimos la informacion ya procesada)

export const insertarPedido = async (req: Request, res: Response) => {
  const { idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido } = req.body;

  try {
    const connection = await pool.getConnection();

    try {
      // Iniciar transacción
      await connection.beginTransaction();

      // Verificamo si el idcliente  existe en la base de datos
      const [clienteRows] = await connection.query('SELECT id FROM cliente WHERE id = ?', [idcliente]);
      if ((clienteRows as any).length === 0) {
        await connection.rollback();  // Si el cliente no existe, no hacemos la transaccion
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      // Verificamos si el nroComprobante ya existe
      const [comprobanteRows] = await connection.query('SELECT id FROM pedido_venta WHERE nroComprobante = ?', [nroComprobante]);
      if ((comprobanteRows as any).length > 0) {
        await connection.rollback();  // Si el nroComprobante ya existe, no hacemos la transaccion
        return res.status(400).json({ error: 'Número de comprobante ya en uso' });
      }

      // Insertar el nuevo pedido
      const [result] = await connection.query(
        'INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido) VALUES (?, ?, ?, ?, ?, ?)',
        [idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido]
      );

      // Confirmamos la transaccion
      await connection.commit();

      res.status(201).json({ message: 'Pedido insertado exitosamente', pedidoId: (result as any).insertId });
    } catch (error) {
      await connection.rollback();  
      console.error(error);
      res.status(500).json({ error: 'Error al insertar el pedido' });
    } finally {
      connection.release(); 
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
};

// Metodo PUT (La logica de la informacion modificada tambien es realizada en el front end)

export const modificarPedido = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido } = req.body;

  try {
    const connection = await pool.getConnection();

    try {
      
      await connection.beginTransaction();

      // Verificamos si el pedido existe
      const [pedidoRows] = await connection.query('SELECT id FROM pedido_venta WHERE id = ?', [id]);
      if ((pedidoRows as any).length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      // Verificamos si el cliente existe
      const [clienteRows] = await connection.query('SELECT id FROM cliente WHERE id = ?', [idcliente]);
      if ((clienteRows as any).length === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }

      // Verificamos si el nroComprobante ya existe en otro pedido
      const [comprobanteRows] = await connection.query(
        'SELECT id FROM pedido_venta WHERE nroComprobante = ? AND id != ?',
        [nroComprobante, id]
      );
      if ((comprobanteRows as any).length > 0) {
        await connection.rollback();
        return res.status(400).json({ error: 'Número de comprobante ya en uso por otro pedido' });
      }

      // Actualizamos el pedido
      await connection.query(
        'UPDATE pedido_venta SET idcliente = ?, fechaPedido = ?, nroComprobante = ?, formaPago = ?, observaciones = ?, totalPedido = ? WHERE id = ?',
        [idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido, id]
      );

      // Confirmar la transacción
      await connection.commit();

      res.json({ message: 'Pedido actualizado exitosamente' });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el pedido' });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
};

//Metodo DELETE

export const eliminarPedido = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    const connection = await pool.getConnection();
  
    try {
      // Iniciar la transacción
      await connection.beginTransaction();
  
      // Eliminamos los detalles del pedido en la tabla pedido_venta_detalle
      await connection.query('DELETE FROM pedido_venta_detalle WHERE idpedidoventa = ?', [id]);
  
      // Luego, eliminamos el pedido en la tabla pedido_venta
      const [result] = await connection.query('DELETE FROM pedido_venta WHERE id = ?', [id]);
  
      // Verificar si se elimino algun registro de pedido_venta
      if ((result as any).affectedRows === 0) {
        await connection.rollback(); // Deshacer la transacción si no se encontró el pedido
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      // Confirmar la transacción
      await connection.commit();
      res.json({ message: 'Pedido eliminado exitosamente' });
    } catch (error) {
      // Deshacer la transacción en caso de error
      await connection.rollback();
      res.status(500).json({ error: 'Error al eliminar el pedido' });
    } finally {
      // Liberar la conexión
      connection.release();
    }
  };

//Metodo para generar pdfs
export const generarPdfPorId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {

    const [pedidoResult] = await pool.query('SELECT * FROM pedido_venta WHERE id = ?', [id]) as any[];
    const pedido = pedidoResult[0];
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const [clienteResult] = await pool.query('SELECT * FROM cliente WHERE id = ?', [pedido.idcliente]) as any[];
    const cliente = clienteResult[0];
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    //detalles del pedido
    const [detallesResult] = await pool.query('SELECT * FROM pedido_venta_detalle WHERE idpedidoventa = ?', [id]) as any[];

    //  documento PDF y nombre para la descarga
    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', `attachment; filename="pedido_${pedido.nroComprobante}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Titulo
    doc.fontSize(18).text('PEDIDO DE VENTA', { align: 'center' }).moveDown();

    // Informacion del pedido
    doc.fontSize(12).text(`Número Comprobante: ${pedido.nroComprobante}`).moveDown();
    doc.text(`Fecha: ${new Date(pedido.fechaPedido).toLocaleDateString()}`).moveDown();
    doc.text(`Cliente:`).moveDown();
    doc.text(`            Razon Social: ${cliente.razonSocial}`);
    doc.text(`            Cuit: ${cliente.cuit}`).moveDown();
    doc.text(`Forma de Pago: ${pedido.formaPago}`).moveDown();
    doc.text(`Observaciones: ${pedido.observaciones}`).moveDown();
    doc.text(`Detalle:`).moveDown();

    // nombres de columnas
    const tableData = {
      headers: ['Código Producto', 'Denominación', 'Precio', 'Cantidad', 'Subtotal'],
      rows: [] as any[],
    };

    for (const detalle of detallesResult) {
      const [productoResult] = await pool.query('SELECT * FROM producto WHERE id = ?', [detalle.idproducto]) as any[];
      const producto = productoResult[0];
      
      if (producto) {
        tableData.rows.push([
          producto.codigoProducto,
          producto.denominacion,
          `$ ${producto.precioVenta}`,
          detalle.cantidad,
          `$ ${detalle.subtotal}`,
        ]);
      }
    }

    // Agregar la tabla de detalles al PDF
    await (doc as any).table(tableData, {
      prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
      prepareRow: (row: any, i: number) => doc.font('Helvetica').fontSize(10),
    });

    // total
    doc.moveDown().fontSize(14).text(`Total: $ ${pedido.totalPedido}`, { align: 'right' });

    doc.end();

  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).json({ error: 'Error al generar el PDF' });
  }
};