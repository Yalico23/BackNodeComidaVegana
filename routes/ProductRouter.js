import express from 'express'
import { newProduct, subirArchivo, getAllProducts, getOneProduct, updateProduct, deleteProduct } from '../controllers/ProductosController.js';
import auth from "../middleware/auth.js"

const routerProductos = express.Router()

routerProductos.post("/product" , auth, subirArchivo, newProduct)
routerProductos.put("/product/:idProducto" , auth, subirArchivo, updateProduct)

routerProductos.get("/product" , auth, getAllProducts)
routerProductos.get("/product/:idProducto" , auth, getOneProduct)

routerProductos.delete("/product/:idProducto" , auth, deleteProduct)

export default routerProductos