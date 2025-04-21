import { connect } from '../config/db/connect.js';

// Mostrar todas las selecciones de guerreros
export const showPlayerSelection = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM playerselection"; // Selecciona todas las selecciones de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve las selecciones de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo selecciones de guerreros", details: error.message });
  }
};

// Mostrar una selección de guerrero por ID
export const showPlayerSelectionId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM playerselection WHERE id = ?"; // Selecciona una selección de guerrero específica
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Selección de guerrero no encontrada" });
    res.status(200).json(result[0]); // Devuelve la selección de guerrero encontrada
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo selección de guerrero", details: error.message });
  }
};

// Registrar una nueva selección de guerrero
export const addPlayerSelection = async (req, res) => {
  try {
    const { game_id, player_id, card_id } = req.body; // Datos necesarios para registrar la selección de guerrero
    if (!game_id || !player_id || !card_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios para la selección de guerrero" });
    }

    const sqlQuery = `
      INSERT INTO playerselection (game_id, player_id, card_id, selected_at)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await connect.query(sqlQuery, [game_id, player_id, card_id]);

    res.status(201).json({
      message: "Selección de guerrero añadida exitosamente",
      data: { id: result.insertId, game_id, player_id, card_id, selected_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo selección de guerrero", details: error.message });
  }
};

// Actualizar una selección de guerrero por ID
export const updatePlayerSelection = async (req, res) => {
  try {
    const { game_id, player_id, card_id } = req.body; // Datos necesarios para actualizar la selección de guerrero
    if (!game_id || !player_id || !card_id) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar la selección de guerrero" });
    }

    const sqlQuery = `UPDATE playerselection SET game_id=?, player_id=?, card_id=?, selected_at=NOW() WHERE id=?`;
    const [result] = await connect.query(sqlQuery, [game_id, player_id, card_id, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Selección de guerrero no encontrada" });

    res.status(200).json({
      message: "Selección de guerrero actualizada exitosamente",
      data: { game_id, player_id, card_id, selected_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando selección de guerrero", details: error.message });
  }
};

// Eliminar una selección de guerrero por ID
export const deletePlayerSelection = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM playerselection WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Selección de guerrero no encontrada" });

    res.status(200).json({
      message: "Selección de guerrero eliminada exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando selección de guerrero", details: error.message });
  }
};