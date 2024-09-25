import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  
  if (!authHeader) {
    return res.status(401).json({ mensaje: "No identificado, no hay JWT" });
  }

  // Obtener el token
  const token = authHeader.split(" ")[1]; // Authorization: Bearer 90915948945 (posición [1])

  try {
    // Verificar y decodificar el token
    const revisarToken = jwt.verify(token, process.env.LLAVESECRETA || 'LLAVESECRETA');

    // Si el token es válido, puedes guardar los datos del usuario en req.user
    req.user = revisarToken;

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ mensaje: "Token expirado" });
    } 
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ mensaje: "Token no válido" });
    }
    return res.status(500).json({ mensaje: "Error en la autenticación" });
  }

  // Si el token es válido, proceder
  next();
};

export default auth;
