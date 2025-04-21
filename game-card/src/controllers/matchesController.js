import { connect } from '../config/db/connect.js';

// Mostrar todos los enfrentamientos de guerreros
export const showMatches = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM matches"; // Selecciona todos los enfrentamientos de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los enfrentamientos de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo enfrentamientos de guerreros", details: error.message });
  }
};

// Mostrar un enfrentamiento de guerreros por ID
export const showMatchesId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM matches WHERE id = ?"; // Selecciona un enfrentamiento de guerreros específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Enfrentamiento de guerreros no encontrado" });
    res.status(200).json(result[0]); // Devuelve el enfrentamiento de guerreros encontrado
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo enfrentamiento de guerreros", details: error.message });
  }
};

// Registrar un nuevo enfrentamiento de guerreros
export const addMatches = async (req, res) => {
  try {
    const { player1_id, player2_id, status } = req.body; // Datos necesarios para registrar un enfrentamiento de guerreros
    if (!player1_id || !player2_id || !status) {
      return res.status(400).json({ error: "Faltan campos obligatorios para registrar un enfrentamiento de guerreros" });
    }

    const sqlQuery = `
      INSERT INTO matches (player1_id, player2_id, status, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const [result] = await connect.query(sqlQuery, [player1_id, player2_id, status]);

    res.status(201).json({
      message: "Enfrentamiento de guerreros añadido exitosamente",
      data: { id: result.insertId, player1_id, player2_id, status, created_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo enfrentamiento de guerreros", details: error.message });
  }
};

// Actualizar un enfrentamiento de guerreros por ID
export const updateMatches = async (req, res) => {
  try {
    const { status, winner_id, reason_for_win } = req.body; // Datos necesarios para actualizar el enfrentamiento de guerreros
    if (!status) {
      return res.status(400).json({ error: "El estado es obligatorio para actualizar un enfrentamiento de guerreros" });
    }

    const sqlQuery = `
      UPDATE matches
      SET status=?, winner_id=?, reason_for_win=?, updated_at=NOW()
      WHERE id=?
    `;
    const [result] = await connect.query(sqlQuery, [status, winner_id, reason_for_win, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Enfrentamiento de guerreros no encontrado" });

    res.status(200).json({
      message: "Enfrentamiento de guerreros actualizado exitosamente",
      data: { status, winner_id, reason_for_win, updated_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando enfrentamiento de guerreros", details: error.message });
  }
};

// Eliminar un enfrentamiento de guerreros por ID
export const deleteMatches = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM matches WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Enfrentamiento de guerreros no encontrado" });

    res.status(200).json({
      message: "Enfrentamiento de guerreros eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando enfrentamiento de guerreros", details: error.message });
  }
};