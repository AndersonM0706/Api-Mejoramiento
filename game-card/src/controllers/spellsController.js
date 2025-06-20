import { connect } from '../config/db/connect.js';

// Mostrar todos los hechizos de guerreros
export const showSpells = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM spells"; // Selecciona todos los hechizos de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los hechizos de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo hechizos de guerreros", details: error.message });
  }
};

// Mostrar un hechizo de guerrero por ID
export const showSpellsId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM spells WHERE id = ?"; // Selecciona un hechizo de guerrero específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Hechizo de guerrero no encontrado" });
    res.status(200).json(result[0]); // Devuelve el hechizo de guerrero encontrado
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo hechizo de guerrero", details: error.message });
  }
};

// Registrar un nuevo hechizo de guerrero
export const addSpells = async (req, res) => {
  try {
    const { name, type, description, value } = req.body; // Datos necesarios para registrar el hechizo de guerrero
    if (!name || !type || !description || !value) {
      return res.status(400).json({ error: "Faltan campos obligatorios para el hechizo de guerrero" });
    }

    const sqlQuery = "INSERT INTO spells (name, type, description, value) VALUES (?, ?, ?, ?)";
    const [result] = await connect.query(sqlQuery, [name, type, description, value]);

    res.status(201).json({
      message: "Hechizo de guerrero añadido exitosamente",
      data: { id: result.insertId, name, type, description, value }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo hechizo de guerrero", details: error.message });
  }
};

// Actualizar un hechizo de guerrero por ID
export const updateSpells = async (req, res) => {
  try {
    const { name, type, description, value } = req.body; // Datos necesarios para actualizar el hechizo de guerrero
    if (!name || !type || !description || !value) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar el hechizo de guerrero" });
    }

    const sqlQuery = "UPDATE spells SET name=?, type=?, description=?, value=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [name, type, description, value, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Hechizo de guerrero no encontrado" });

    res.status(200).json({
      message: "Hechizo de guerrero actualizado exitosamente",
      data: { name, type, description, value }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando hechizo de guerrero", details: error.message });
  }
};

// Eliminar un hechizo de guerrero por ID
export const deleteSpells = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM spells WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Hechizo de guerrero no encontrado" });

    res.status(200).json({
      message: "Hechizo de guerrero eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando hechizo de guerrero", details: error.message });
  }
};