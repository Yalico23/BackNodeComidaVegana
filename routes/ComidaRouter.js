import express from 'express'
import { newFood, subirArchivo , getAllProducts} from '../controllers/ComidaController.js'

//import auth from "../middleware/auth.js"

const routerComidas = express.Router()

//routerComidas.post("/product" , auth, subirArchivo, newProduct)
routerComidas.post("/add" , subirArchivo, newFood)
// routerComidas.put("/product/:idProducto" , auth, subirArchivo, updateProduct)

routerComidas.get("/foods", getAllProducts)
// routerComidas.get("/product/:idProducto" , auth, getOneProduct)

// routerComidas.delete("/product/:idProducto" , auth, deleteProduct)

export default routerComidas