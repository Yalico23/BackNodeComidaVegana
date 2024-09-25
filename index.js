import express from "express";
import mongoose from "mongoose";
import routerClientes from "./routes/ClienteRouter.js";
import routerProductos from "./routes/ProductRouter.js";
import routerPedido from "./routes/PedidoRouter.js";
import routerUsuarios from "./routes/UsuarioRouter.js";
import routerComidas from "./routes/ComidaRouter.js";
import cors from 'cors';
import dotenv from 'dotenv';

// Variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      family: 4,
    });
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB", error);
    process.exit(1); // Salir del proceso con error
  }
};

connectDB();

// Crear app
const app = express();

// Activar mandado json y post
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Carpeta Pública
app.use(express.static('uploads'));

// Definir un dominio(s) para recibir peticiones
const whiteList = ['https://crm.yalicodev.online', 'http://localhost:5173', 'https://crmyalico.netlify.app'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por Cors'));
    }
  }
};

// Habilitar CORS
app.use(cors(corsOptions));

// Rutas
app.use("/clientes", routerClientes);
app.use("/productos", routerProductos); // localhost:3000/productos/...
app.use("/pedidos", routerPedido);
app.use("/usuarios", routerUsuarios);
app.use("/comidas", routerComidas);

// Puerto
const port = process.env.PORT || 5000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  console.log(`El servidor está funcionando en http://${host}:${port}`);
});
