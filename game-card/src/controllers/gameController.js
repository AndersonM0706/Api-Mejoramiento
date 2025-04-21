import { connect } from '../config/db/connect.js';

// Mostrar todos los juegos de guerreros
export const showGame = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM game"; // Selecciona todos los juegos de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los juegos de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo juegos de guerreros", details: error.message });
  }
};

// Mostrar un juego de guerreros por ID
export const showGameId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM game WHERE id = ?"; // Selecciona un juego de guerreros específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Juego de guerreros no encontrado" });
    res.status(200).json(result[0]); // Devuelve el juego de guerreros encontrado
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo juego de guerreros", details: error.message });
  }
};

// Crear un nuevo juego de guerreros
export const addGame = async (req, res) => {
  try {
    const { player1, player2, status } = req.body; // Datos necesarios para crear el juego de guerreros
    if (!player1 || !player2 || !status) {
      return res.status(400).json({ error: "Faltan campos obligatorios para crear el juego de guerreros" });
    }

    const sqlQuery = "INSERT INTO game (player1, player2, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
    const [result] = await connect.query(sqlQuery, [player1, player2, status]);

    res.status(201).json({
      message: "Juego de guerreros añadido exitosamente",
      data: { id: result.insertId, player1, player2, status, created_at: new Date(), updated_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo juego de guerreros", details: error.message });
  }
};

// Actualizar un juego de guerreros por ID
export const updateGame = async (req, res) => {
  try {
    const { status, winner } = req.body; // Datos necesarios para actualizar el juego de guerreros
    if (!status) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar el juego de guerreros" });
    }

    const sqlQuery = "UPDATE game SET status=?, winner=?, updated_at=NOW() WHERE id=?";
    const [result] = await connect.query(sqlQuery, [status, winner, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Juego de guerreros no encontrado" });

    res.status(200).json({
      message: "Juego de guerreros actualizado exitosamente",
      data: { status, winner, updated_at: new Date() }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando juego de guerreros", details: error.message });
  }
};

// Eliminar un juego de guerreros por ID
export const deleteGame = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM game WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Juego de guerreros no encontrado" });

    res.status(200).json({
      message: "Juego de guerreros eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando juego de guerreros", details: error.message });
  }
};