import express from 'express';
import pedidoRoutes from './routes/pedidoRoutes';
import clienteRoutes from './routes/clienteRoutes';
import productoRoutes from './routes/productoRoutes';
import detalleRoutes from './routes/detalleRoutes';
import path from 'path'; // Asegúrate de importar path

const app = express();
const PORT = 3000;

app.use(express.json()); 
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));
// rutas de pedidos, clientes, detalles y productos
app.use('/api', pedidoRoutes);
app.use('/api', clienteRoutes);
app.use('/api', productoRoutes);
app.use('/api', detalleRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
