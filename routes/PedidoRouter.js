import express from 'express'
import { nuevoPedido , mostrarPedidos, mostarPedidoId, actualizarPedido, eliminarPedido} from '../controllers/PedidoController.js'
import auth from "../middleware/auth.js"

const routerPedido = express.Router()

//agregar pedidos
routerPedido.post("/pedidos", auth,nuevoPedido)
//mostrar pedidos 
routerPedido.get("/pedidos", auth, mostrarPedidos)
//mostrat 1 pedido por id
routerPedido.get("/pedidos/:idPedido", auth, mostarPedidoId)
//Actualziar pedido
routerPedido.put("/pedidos/:idPedido", auth, actualizarPedido)
//Eliminar Pedido
routerPedido.delete("/pedidos/:idPedido", auth, eliminarPedido)

export default routerPedido