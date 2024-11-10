"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pedidoRoutes_1 = __importDefault(require("./routes/pedidoRoutes"));
const clienteRoutes_1 = __importDefault(require("./routes/clienteRoutes"));
const productoRoutes_1 = __importDefault(require("./routes/productoRoutes"));
const detalleRoutes_1 = __importDefault(require("./routes/detalleRoutes"));
const path_1 = __importDefault(require("path")); // Asegúrate de importar path
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
// rutas de pedidos, clientes, detalles y productos
app.use('/api', pedidoRoutes_1.default);
app.use('/api', clienteRoutes_1.default);
app.use('/api', productoRoutes_1.default);
app.use('/api', detalleRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
