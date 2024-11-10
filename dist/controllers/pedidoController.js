"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarPdfPorId = exports.eliminarPedido = exports.modificarPedido = exports.insertarPedido = exports.getPedidosPorFechas = exports.getPedidoPorComprobante = exports.getPedidoPorId = exports.getPedidos = void 0;
const db_1 = __importDefault(require("../config/db"));
const pdfkit_table_1 = __importDefault(require("pdfkit-table"));
// Metodos GET
const getPedidos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM pedido_venta');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener pedidos' });
    }
});
exports.getPedidos = getPedidos;
const getPedidoPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(`Buscando pedido con id ${id}`);
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM pedido_venta WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        res.json(rows[0]);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
});
exports.getPedidoPorId = getPedidoPorId;
const getPedidoPorComprobante = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nroComprobante = parseInt(req.params.nroComprobante, 10);
    console.log(`Buscando pedido con nroComprobante ${nroComprobante}`);
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM pedido_venta WHERE nroComprobante = ?', [nroComprobante]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows[0]);
        }
        else {
            res.status(404).json({ error: 'Pedido no encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
});
exports.getPedidoPorComprobante = getPedidoPorComprobante;
const getPedidosPorFechas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fechaInicio, fechaFin } = req.query;
    if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Faltan parámetros fechaInicio o fechaFin' });
    }
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: 'Fechas inválidas' });
    }
    console.log(`Buscando pedidos entre ${start.toISOString()} y ${end.toISOString()}`);
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM pedido_venta WHERE fechaPedido BETWEEN ? AND ?', [start.toISOString().split('T')[0], end.toISOString().split('T')[0]]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.json(rows);
        }
        else {
            res.status(404).json({ error: 'No se encontraron pedidos en el rango de fechas especificado' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});
exports.getPedidosPorFechas = getPedidosPorFechas;
//Metodo POST (Para insertar un pedido la logica y datos van a ser realizados en el front y nosotros recibimos la informacion ya procesada)
const insertarPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido } = req.body;
    try {
        const connection = yield db_1.default.getConnection();
        try {
            // Iniciar transacción
            yield connection.beginTransaction();
            // Verificamo si el idcliente  existe en la base de datos
            const [clienteRows] = yield connection.query('SELECT id FROM cliente WHERE id = ?', [idcliente]);
            if (clienteRows.length === 0) {
                yield connection.rollback(); // Si el cliente no existe, no hacemos la transaccion
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            // Verificamos si el nroComprobante ya existe
            const [comprobanteRows] = yield connection.query('SELECT id FROM pedido_venta WHERE nroComprobante = ?', [nroComprobante]);
            if (comprobanteRows.length > 0) {
                yield connection.rollback(); // Si el nroComprobante ya existe, no hacemos la transaccion
                return res.status(400).json({ error: 'Número de comprobante ya en uso' });
            }
            // Insertar el nuevo pedido
            const [result] = yield connection.query('INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido) VALUES (?, ?, ?, ?, ?, ?)', [idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido]);
            // Confirmamos la transaccion
            yield connection.commit();
            res.status(201).json({ message: 'Pedido insertado exitosamente', pedidoId: result.insertId });
        }
        catch (error) {
            yield connection.rollback();
            console.error(error);
            res.status(500).json({ error: 'Error al insertar el pedido' });
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
});
exports.insertarPedido = insertarPedido;
// Metodo PUT (La logica de la informacion modificada tambien es realizada en el front end)
const modificarPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido } = req.body;
    try {
        const connection = yield db_1.default.getConnection();
        try {
            yield connection.beginTransaction();
            // Verificamos si el pedido existe
            const [pedidoRows] = yield connection.query('SELECT id FROM pedido_venta WHERE id = ?', [id]);
            if (pedidoRows.length === 0) {
                yield connection.rollback();
                return res.status(404).json({ error: 'Pedido no encontrado' });
            }
            // Verificamos si el cliente existe
            const [clienteRows] = yield connection.query('SELECT id FROM cliente WHERE id = ?', [idcliente]);
            if (clienteRows.length === 0) {
                yield connection.rollback();
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }
            // Verificamos si el nroComprobante ya existe en otro pedido
            const [comprobanteRows] = yield connection.query('SELECT id FROM pedido_venta WHERE nroComprobante = ? AND id != ?', [nroComprobante, id]);
            if (comprobanteRows.length > 0) {
                yield connection.rollback();
                return res.status(400).json({ error: 'Número de comprobante ya en uso por otro pedido' });
            }
            // Actualizamos el pedido
            yield connection.query('UPDATE pedido_venta SET idcliente = ?, fechaPedido = ?, nroComprobante = ?, formaPago = ?, observaciones = ?, totalPedido = ? WHERE id = ?', [idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido, id]);
            // Confirmar la transacción
            yield connection.commit();
            res.json({ message: 'Pedido actualizado exitosamente' });
        }
        catch (error) {
            yield connection.rollback();
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el pedido' });
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
});
exports.modificarPedido = modificarPedido;
//Metodo DELETE
const eliminarPedido = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const connection = yield db_1.default.getConnection();
    try {
        // Iniciar la transacción
        yield connection.beginTransaction();
        // Eliminamos los detalles del pedido en la tabla pedido_venta_detalle
        yield connection.query('DELETE FROM pedido_venta_detalle WHERE idpedidoventa = ?', [id]);
        // Luego, eliminamos el pedido en la tabla pedido_venta
        const [result] = yield connection.query('DELETE FROM pedido_venta WHERE id = ?', [id]);
        // Verificar si se elimino algun registro de pedido_venta
        if (result.affectedRows === 0) {
            yield connection.rollback(); // Deshacer la transacción si no se encontró el pedido
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        // Confirmar la transacción
        yield connection.commit();
        res.json({ message: 'Pedido eliminado exitosamente' });
    }
    catch (error) {
        // Deshacer la transacción en caso de error
        yield connection.rollback();
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
    finally {
        // Liberar la conexión
        connection.release();
    }
});
exports.eliminarPedido = eliminarPedido;
//Metodo para generar pdfs
const generarPdfPorId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const [pedidoResult] = yield db_1.default.query('SELECT * FROM pedido_venta WHERE id = ?', [id]);
        const pedido = pedidoResult[0];
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        const [clienteResult] = yield db_1.default.query('SELECT * FROM cliente WHERE id = ?', [pedido.idcliente]);
        const cliente = clienteResult[0];
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        //detalles del pedido
        const [detallesResult] = yield db_1.default.query('SELECT * FROM pedido_venta_detalle WHERE idpedidoventa = ?', [id]);
        //  documento PDF y nombre para la descarga
        const doc = new pdfkit_table_1.default();
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
            rows: [],
        };
        for (const detalle of detallesResult) {
            const [productoResult] = yield db_1.default.query('SELECT * FROM producto WHERE id = ?', [detalle.idproducto]);
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
        yield doc.table(tableData, {
            prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
            prepareRow: (row, i) => doc.font('Helvetica').fontSize(10),
        });
        // total
        doc.moveDown().fontSize(14).text(`Total: $ ${pedido.totalPedido}`, { align: 'right' });
        doc.end();
    }
    catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).json({ error: 'Error al generar el PDF' });
    }
});
exports.generarPdfPorId = generarPdfPorId;
