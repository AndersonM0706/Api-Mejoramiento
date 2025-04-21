import { connect } from '../config/db/connect.js';

// Mostrar el ranking completo de guerreros
export const showRanking = async (req, res) => {
  try {
    const sqlQuery = `SELECT r.*, u.username FROM ranking JOIN users u ON r.user_id = u.id
      ORDER BY wins DESC, draws DESC, losses ASC`; // Ordena el ranking por victorias y empates
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve el ranking de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo el ranking de guerreros", details: error.message });
  }
};

// Mostrar el ranking de un guerrero por ID
export const showRankingId = async (req, res) => {
  try {
    const sqlQuery = `
      SELECT r.*, u.username
      FROM ranking r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `; // Muestra el ranking específico del guerrero con detalles de usuario
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Ranking de guerrero no encontrado" });
    res.status(200).json(result[0]); // Devuelve el ranking del guerrero encontrado
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo el ranking del guerrero", details: error.message });
  }
};

// Agregar un nuevo registro al ranking de guerreros
export const addRanking = async (req, res) => {
  try {
    const { user_id, wins, losses, draws } = req.body; // Datos necesarios para registrar el ranking del guerrero
    if (!user_id || wins === undefined || losses === undefined || draws === undefined) {
      return res.status(400).json({ error: "Faltan campos obligatorios para el ranking del guerrero" });
    }

    const sqlQuery = "INSERT INTO ranking (user_id, wins, losses, draws) VALUES (?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [user_id, wins, losses, draws]);

    res.status(201).json({
      message: "Ranking de guerrero añadido exitosamente",
      data: { id: result.insertId, user_id, wins, losses, draws }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo ranking de guerrero", details: error.message });
  }
};

// Actualizar un registro del ranking de guerreros por ID
export const updateRanking = async (req, res) => {
  try {
    const { wins, losses, draws } = req.body; // Datos necesarios para actualizar el ranking del guerrero
    if (wins === undefined || losses === undefined || draws === undefined) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar el ranking del guerrero" });
    }

    const sqlQuery = "UPDATE ranking SET wins=?, losses=?, draws=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [wins, losses, draws, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Ranking de guerrero no encontrado" });

    res.status(200).json({
      message: "Ranking de guerrero actualizado exitosamente",
      data: { wins, losses, draws }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando ranking de guerrero", details: error.message });
  }
};

// Eliminar un registro del ranking de guerreros por ID
export const deleteRanking = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM ranking WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Ranking de guerrero no encontrado" });

    res.status(200).json({
      message: "Ranking de guerrero eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando ranking de guerrero", details: error.message });
  }
};