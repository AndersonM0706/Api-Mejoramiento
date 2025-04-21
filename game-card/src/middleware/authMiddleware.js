import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware para verificar el token de autenticación del guerrero
export const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Acceso denegado, guerrero no autenticado" });

  try{
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = verified;
    // Ver datos del token encriptado del guerrero
    // console.log(verified);
    next();
  } catch (err){
    res.status(400).json({ error: "Token de autenticación inválido" });
  }
};