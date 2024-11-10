/*
SQLyog Ultimate v9.02 
MySQL - 5.5.5-10.4.32-MariaDB : Database - facturacion
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`facturacion` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `facturacion`;

/*Table structure for table `cliente` */

DROP TABLE IF EXISTS `cliente`;

CREATE TABLE `cliente` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cuit` varchar(20) NOT NULL,
  `razonSocial` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cuit` (`cuit`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `cliente` */

insert  into `cliente`(`id`,`cuit`,`razonSocial`) values (1,'20-12345678-9','Carlos Fernandez'),(2,'30-87654321-0','Franco Paz'),(3,'27-45678912-3','Luis Mas'),(4,'23-23456789-7','Juan Rojo');

/*Table structure for table `pedido_venta` */

DROP TABLE IF EXISTS `pedido_venta`;

CREATE TABLE `pedido_venta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `idcliente` bigint(20) NOT NULL,
  `fechaPedido` date NOT NULL,
  `nroComprobante` bigint(20) NOT NULL,
  `formaPago` varchar(50) NOT NULL,
  `observaciones` text DEFAULT NULL,
  `totalPedido` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nroComprobante` (`nroComprobante`),
  KEY `idcliente` (`idcliente`),
  CONSTRAINT `pedido_venta_ibfk_1` FOREIGN KEY (`idcliente`) REFERENCES `cliente` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pedido_venta` */
/*Table structure for table `producto` */

DROP TABLE IF EXISTS `producto`;

CREATE TABLE `producto` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `codigoProducto` varchar(50) NOT NULL,
  `denominacion` varchar(255) NOT NULL,
  `precioVenta` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigoProducto` (`codigoProducto`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `producto` */

insert  into `producto`(`id`,`codigoProducto`,`denominacion`,`precioVenta`) values (1,'P001','Laptop Dell Inspiron','150000.00'),(2,'P002','Mouse Logitech','3500.00'),(3,'P003','Monitor LG 24','45000.00'),(4,'P004','Teclado Razer','12000.00'),(5,'P005','Samsung Galaxy S23','250000.00'),(6,'P006','Auriculares Sony 1000X','30000.00'),(7,'P007','Impresora HP LaserJet','50000.00'),(8,'P008','Apple iPad Pro 12.9','180000.00');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*Table structure for table `pedido_venta_detalle` */

DROP TABLE IF EXISTS `pedido_venta_detalle`;

CREATE TABLE `pedido_venta_detalle` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `idpedidoventa` bigint(20) NOT NULL,
  `idproducto` bigint(20) NOT NULL,
  `cantidad` int(10) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idpedidoventa` (`idpedidoventa`),
  KEY `idproducto` (`idproducto`),
  CONSTRAINT `pedido_venta_detalle_ibfk_1` FOREIGN KEY (`idpedidoventa`) REFERENCES `pedido_venta` (`id`),
  CONSTRAINT `pedido_venta_detalle_ibfk_2` FOREIGN KEY (`idproducto`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*Data for the table `pedido_venta_detalle` */


