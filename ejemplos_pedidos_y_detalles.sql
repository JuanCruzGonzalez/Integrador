-- Ejemplos para agregar a la base de datos,
--para que esto funcione la base de datos tiene estar con el id de pedido venta en 0
-- es decir primero uso el facturacion_base.sql y luego de eso le inserto los ejemplos de este archivo

INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido)
VALUES (1, '2024-11-10', 1001, 'Efectivo', 'Pedido por teléfono', 157000.00);

INSERT INTO pedido_venta_detalle (idpedidoventa, idproducto, cantidad, subtotal)
VALUES
  (1, 1, 1, 150000.00),  -- Laptop Dell
  (1, 2, 2, 7000.00);


INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido)
VALUES (2, '2024-11-11', 1002, 'Tarjeta de crédito', 'Pedido online', 292000.00);

INSERT INTO pedido_venta_detalle (idpedidoventa, idproducto, cantidad, subtotal)
VALUES
  (2, 5, 1, 250000.00),  -- Samsung Galaxy S23
  (2, 6, 1, 30000.00),  -- Auriculares Sony
  (2, 4, 1, 12000.00);


INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido)
VALUES (3, '2024-11-12', 1003, 'Transferencia bancaria', 'Pedido corporativo', 325000.00);

INSERT INTO pedido_venta_detalle (idpedidoventa, idproducto, cantidad, subtotal)
VALUES
  (3, 3, 5, 225000.00),  -- 5 Monitores LG
  (3, 7, 2, 100000.00);  -- 2 Impresoras HP

INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido)
VALUES (4, '2024-11-13', 1004, 'Débito', 'Pedido con descuento', 190500.00);

INSERT INTO pedido_venta_detalle (idpedidoventa, idproducto, cantidad, subtotal)
VALUES
  (4, 8, 1, 180000.00),  -- Apple iPad Pro
  (4, 2, 3, 10500.00);  -- 3 Mouse Logitech