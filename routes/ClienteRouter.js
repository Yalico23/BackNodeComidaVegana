import express from "express"
import {getAllClient, newClient, getOneClient, updateClient, deleteClient} from "../controllers/ClienteController.js"
import auth from "../middleware/auth.js" //seguridad

const router = express.Router()

router.post("/clientes" , auth,newClient)
router.get("/clientes" , auth, getAllClient)
router.get("/client/:idClient", auth,getOneClient)
router.put("/client/:idClient", auth,updateClient)
router.delete("/client/:idClient",auth, deleteClient)

export default router