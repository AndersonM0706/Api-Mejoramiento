import { connect } from '../config/db/connect.js'; // Importación del conector de la base de datos

// Obtiene todos los guerreros de la base de datos
export const getAll = async () => {
  const [rows] = await connect.query('SELECT * FROM guerreros'); // Consulta para obtener todos los registros de la tabla "guerreros"
  return rows;
};

// Obtiene guerreros por sus IDs de la base de datos
export const getByIds = async (ids) => {
  const placeholders = ids.map(() => '?').join(','); // Crear placeholders dinámicos para la consulta
  const [rows] = await connect.query(
    `SELECT * FROM guerreros WHERE id IN (${placeholders})`,
    ids
  );
  return rows;
};

// Exportación por defecto (opcional, si quieres usarlo como un objeto)
export default { getAll, getByIds };