import { connect } from '../config/db/connect.js'; // Importación de la conexión a la base de datos

// Crea una nueva selección de guerrero para un usuario
export const create = async (userId, guerreroId) => {
  const [result] = await connect.query(
    'INSERT INTO player_selection (user_id, warrior_id) VALUES (?, ?)',
    [userId, guerreroId]
  );
  return result.insertId;
};

// Obtiene la selección de guerreros de un usuario
export const getUserSelection = async (userId) => {
  const [rows] = await connect.query(
    `SELECT ps.*, w.name AS guerrero_name, p.name AS poder, s.name AS hechizo
      FROM player_selection ps
      LEFT JOIN guerreros w ON ps.warrior_id = w.id
      LEFT JOIN power p ON w.power_id = p.id
      LEFT JOIN spells s ON w.spell_id = s.id
      WHERE ps.user_id = ?`,
    [userId]
  );
  return rows;
};

// Exportación por defecto (opcional)
export default { create, getUserSelection };