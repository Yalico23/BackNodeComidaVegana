import Usuario from "../models/usuarios.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import dotenv from 'dotenv'

dotenv.config()

const registrarUsuario = async (req ,res , next) => {
    //leer los datos del usuario y colocarlos en Usuarios
    const usuario = new Usuario(req.body)
    usuario.password = await bcrypt.hash(req.body.password,12)
    try {
        await usuario.save()
        res.json({mensaje: "Usuario Creado Correctamente"})
    } catch (error) {
        console.log(error)
        res.json({mensaje: "hubo un error"})
    }
}

const autenticarUsuario = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const usuario = await Usuario.findOne({ email });
  
      if (!usuario) {
        return res.status(401).json({ mensaje: "Ese usuario no existe" });
      }
  
      const esPasswordCorrecto = bcrypt.compareSync(password, usuario.password);
      if (!esPasswordCorrecto) {
        return res.status(401).json({ mensaje: "Password Incorrecto" });
      }
  
      // Generar el token JWT
      const token = jwt.sign(
        {
          email: usuario.email,
          nombre: usuario.nombre,
          id: usuario._id,
        },
        process.env.JWT_KEY, // Mejor manejar la clave secreta en variables de entorno
        { expiresIn: '1h' }
      );
  
      // Retornar el token
      return res.json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensaje: "Hubo un error en el servidor" });
    }
  };
  

export {
    registrarUsuario,
    autenticarUsuario
}