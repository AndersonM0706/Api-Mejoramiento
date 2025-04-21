import { connect } from '../../config/db/connect.js'; // Importación del conector de la base de datos

// Obtiene el ranking de poder de todos los guerreros
export const getRanking = async () => {
  const [rows] = await connect.query(`
    SELECT
      u.username AS jugador,
      w.name AS guerrero,
      p.name AS poder,
      s.name AS hechizo,
      (p.value + s.value) AS poder_total
    FROM player_selection ps
    JOIN users u ON ps.user_id = u.id
    JOIN guerreros w ON ps.warrior_id = w.id
    JOIN power p ON w.power_id = p.id
    JOIN spells s ON w.spell_id = s.id
    ORDER BY poder_total DESC
  `);

  return rows;
};

// Exportación por defecto (opcional)
export default { getRanking };