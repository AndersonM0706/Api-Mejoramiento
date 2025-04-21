import { connect } from '../config/db/connect.js';

// Mostrar todos los combates de guerreros
export const showFight = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM fight"; // Selecciona todos los combates de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los combates de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo combates de guerreros", details: error.message });
  }
};

// Mostrar un combate de guerreros por ID
export const showFightId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM fight WHERE id = ?"; // Selecciona un combate de guerreros específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Combate de guerreros no encontrado" });
    res.status(200).json(result[0]); // Devuelve el combate de guerreros encontrado
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo combate de guerreros", details: error.message });
  }
};

// Registrar un nuevo combate de guerreros
export const addFight = async (req, res) => {
  try {
    const { player1, player2, card1, card2, winner } = req.body; // Datos necesarios para registrar el combate de guerreros
    if (!player1 || !player2 || !card1 || !card2 || !winner) {
      return res.status(400).json({ error: "Faltan campos obligatorios para registrar el combate de guerreros" });
    }

    const sqlQuery = "INSERT INTO fight (player1, player2, card1, card2, winner, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    const [result] = await connect.query(sqlQuery, [player1, player2, card1, card2, winner]);

    res.status(201).json({
      message: "Combate de guerreros registrado exitosamente",
      data: { id: result.insertId, player1, player2, card1, card2, winner, created_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error registrando combate de guerreros", details: error.message });
  }
};

// Actualizar un combate de guerreros por ID
export const updateFight = async (req, res) => {
  try {
    const { player1, player2, card1, card2, winner } = req.body; // Datos necesarios para actualizar el combate de guerreros
    if (!player1 || !player2 || !card1 || !card2 || !winner) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar el combate de guerreros" });
    }

    const sqlQuery = "UPDATE fight SET player1=?, player2=?, card1=?, card2=?, winner=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [player1, player2, card1, card2, winner, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Combate de guerreros no encontrado" });

    res.status(200).json({
      message: "Combate de guerreros actualizado exitosamente",
      data: { player1, player2, card1, card2, winner }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando combate de guerreros", details: error.message });
  }
};

// Eliminar un combate de guerreros por ID
export const deleteFight = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM fight WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Combate de guerreros no encontrado" });

    res.status(200).json({
      message: "Combate de guerreros eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando combate de guerreros", details: error.message });
  }
};