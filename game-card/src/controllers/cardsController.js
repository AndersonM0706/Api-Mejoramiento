import { connect } from '../config/db/connect.js';

// Mostrar todas las cartas de guerreros
export const showCards = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM cards"; // Selecciona todas las cartas de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve las cartas de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo cartas de guerreros", details: error.message });
  }
};

// Mostrar una carta de guerrero por ID
export const showCardId = async (req, res) => {
  try {
    const sqlQuery = 'SELECT * FROM cards WHERE id = ?'; // Selecciona una carta de guerrero específica
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Carta de guerrero no encontrada" });
    res.status(200).json(result[0]); // Devuelve la carta de guerrero encontrada
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo carta de guerrero", details: error.message });
  }
};

// Crear una nueva carta de guerrero
export const addCard = async (req, res) => {
  try {
    const { warrior_id, description, image_url } = req.body; // Datos necesarios para crear la carta de guerrero
    if (!warrior_id || !description || !image_url) {
      return res.status(400).json({ error: "Faltan campos obligatorios para la carta de guerrero" });
    }

    const sqlQuery = "INSERT INTO cards (warrior_id, description, image_url) VALUES (?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [warrior_id, description, image_url]);

    res.status(201).json({
      message: "Carta de guerrero añadida exitosamente",
      data: { id: result.insertId, warrior_id, description, image_url }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo carta de guerrero", details: error.message });
  }
};

// Actualizar una carta de guerrero por ID
export const updateCard = async (req, res) => {
  try {
    const { warrior_id, description, image_url } = req.body; // Datos necesarios para actualizar la carta de guerrero
    if (!warrior_id || !description || !image_url) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar la carta de guerrero" });
    }

    const sqlQuery = "UPDATE cards SET warrior_id=?, description=?, image_url=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [warrior_id, description, image_url, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Carta de guerrero no encontrada" });

    res.status(200).json({
      message: "Carta de guerrero actualizada exitosamente",
      data: { warrior_id, description, image_url }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando carta de guerrero", details: error.message });
  }
};

// Eliminar una carta de guerrero por ID
export const deleteCard = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM cards WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Carta de guerrero no encontrada" });

    res.status(200).json({
      message: "Carta de guerrero eliminada exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando carta de guerrero", details: error.message });
  }
};