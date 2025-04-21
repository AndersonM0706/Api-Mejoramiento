import { connect } from '../config/db/connect.js';

// Mostrar todos los guerreros
export const showGuerreros = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM guerreros"; // Selecciona todos los guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo guerreros", details: error.message });
  }
};

// Mostrar un guerrero por ID
export const showGuerreroId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM guerreros WHERE id = ?"; // Selecciona un guerrero específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Guerrero no encontrado" });
    res.status(200).json(result[0]); // Devuelve el guerrero encontrado
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo guerrero", details: error.message });
  }
};

// Registrar un nuevo guerrero
export const addGuerrero = async (req, res) => {
  try {
    const { name, race_id, power_id, spell_id, image_url, description } = req.body; // Datos necesarios para registrar el guerrero
    if (!name || !race_id || !power_id || !spell_id || !image_url || !description) {
      return res.status(400).json({ error: "Faltan campos obligatorios para registrar el guerrero" });
    }

    const sqlQuery = `INSERT INTO guerreros (name, race_id, power_id, spell_id, image_url, description) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await connect.query(sqlQuery, [name, race_id, power_id, spell_id, image_url, description]);

    res.status(201).json({
      message: "Guerrero añadido exitosamente",
      data: { id: result.insertId, name, race_id, power_id, spell_id, image_url, description }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo guerrero", details: error.message });
  }
};

// Actualizar un guerrero por ID
export const updateGuerrero = async (req, res) => {
  try {
    const { name, race_id, power_id, spell_id, image_url, description } = req.body; // Datos necesarios para actualizar el guerrero
    if (!name || !race_id || !power_id || !spell_id || !image_url || !description) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar el guerrero" });
    }

    const sqlQuery = `UPDATE guerreros SET name=?, race_id=?, power_id=?, spell_id=?, image_url=?, description=? WHERE id=?`;
    const [result] = await connect.query(sqlQuery, [name, race_id, power_id, spell_id, image_url, description, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Guerrero no encontrado" });

    res.status(200).json({
      message: "Guerrero actualizado exitosamente",
      data: { name, race_id, power_id, spell_id, image_url, description }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando guerrero", details: error.message });
  }
};

// Eliminar un guerrero por ID
export const deleteGuerrero = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM guerreros WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Guerrero no encontrado" });

    res.status(200).json({
      message: "Guerrero eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando guerrero", details: error.message });
  }
};