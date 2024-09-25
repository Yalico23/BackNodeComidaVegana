import express from 'express'
import { registrarUsuario, autenticarUsuario } from '../controllers/UsuarioController.js'

const routerUsuarios = express.Router()

//endpoints
routerUsuarios.post("/register", registrarUsuario)
routerUsuarios.post("/login",  autenticarUsuario)

export default routerUsuarios