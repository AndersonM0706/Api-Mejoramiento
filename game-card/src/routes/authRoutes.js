import express from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../models/usersModel.js'; // Importar funciones del modelo de usuarios de guerreros
import jwt from 'jsonwebtoken'; // Para generar el token JWT de autenticación de guerreros
import { encryptPassword, comparePassword } from '../library/appBcrypt.js'; // Encriptar y comparar contraseñas de guerreros

const router = express.Router();

// Ruta para registrar un nuevo guerrero
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).withMessage('El nombre de usuario del guerrero debe tener al menos 3 caracteres'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña del guerrero debe tener al menos 6 caracteres'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;

      // Encriptar la contraseña del guerrero antes de guardar en la base de datos
      const hashedPassword = await encryptPassword(password);

      // Registrar al guerrero utilizando el modelo
      const user = await register(username, hashedPassword);

      res.status(201).json({
        message: 'Guerrero registrado exitosamente',
        user,
      });
    } catch (err) {
      res.status(500).json({
        error: 'El registro del guerrero falló',
        details: err.message,
      });
    }
  }
);

// Ruta para iniciar sesión de un guerrero
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('El nombre de usuario del guerrero es requerido'),
    body('password').notEmpty().withMessage('La contraseña del guerrero es requerida'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password } = req.body;

      // Buscar al guerrero en la base de datos
      const user = await login(username, password);
      if (!user) {
        return res.status(401).json({ error: 'Credenciales de guerrero inválidas' });
      }

      // Comparar la contraseña ingresada con la almacenada del guerrero
      const contraseñaIsValid = await comparePassword(password, user.password);
      if (!contraseñaIsValid) {
        return res.status(401).json({ error: 'Credenciales de guerrero inválidas' });
      }

      // Generar un token JWT para la autenticación del guerrero
      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({
        message: 'Inicio de sesión del guerrero exitoso',
        token,
        user,
      });
    } catch (err) {
      res.status(500).json({
        error: 'El inicio de sesión del guerrero falló',
        details: err.message,
      });
    }
  }
);

export default router; // Exportación ES6