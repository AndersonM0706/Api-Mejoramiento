import jwt from 'jsonwebtoken';
import { connect } from '../config/db/connect.js';
import { encryptPassword, comparePassword } from '../library/appBcrypt.js';

// Registro de un nuevo usuario para el juego de guerreros
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación de campos obligatorios para el registro del guerrero
    if (!username || !password) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios para registrar un guerrero.' });
    }

    // Verificar si el guerrero ya existe por su nombre de usuario
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    const [existingUser] = await connect.query(checkUserQuery, [username]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario del guerrero ya está registrado.' });
    }

    // Encriptar la contraseña del guerrero
    const hashedPassword = await encryptPassword(password);

    // Insertar el nuevo guerrero en la base de datos
    const insertUserQuery = 'INSERT INTO users (username, password, created_at) VALUES (?, ?, NOW())';
    const [result] = await connect.query(insertUserQuery, [username, hashedPassword]);

    // Generar token JWT para autenticar al nuevo guerrero
    const token = jwt.sign(
      { id: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Guerrero registrado con éxito.',
      data: { id: result.insertId, username, created_at: new Date(), token },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error registrando guerrero.', details: error.message });
  }
};

// Inicio de sesión de un guerrero existente
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si el guerrero existe en la base de datos por su nombre de usuario
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
    const [result] = await connect.query(checkUserQuery, [username]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Guerrero no encontrado.' });
    }

    const user = result[0];

    // Comparar la contraseña ingresada con la contraseña almacenada del guerrero
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Contraseña incorrecta del guerrero.' });
    }

    // Generar token JWT para la sesión del guerrero
    const token = jwt.sign(
      { id: user.id, username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Inicio de sesión del guerrero exitoso.',
      data: { id: user.id, username, created_at: user.created_at, token },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error iniciando sesión del guerrero.', details: error.message });
  }
};