import { connect } from '../config/db/connect.js'; // Importación de la conexión

// Registra un nuevo guerrero en la base de datos
export const register = async (username, password) => {
  const [result] = await connect.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password]
  );
  return result;
};

// Inicia la sesión de un guerrero verificando sus credenciales
export const login = async (username, password) => {
  const [rows] = await connect.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password]
  );
  return rows[0];
};

// Exportación por defecto (si quieres usarla como objeto)
export default { register, login };