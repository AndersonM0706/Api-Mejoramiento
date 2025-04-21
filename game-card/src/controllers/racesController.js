import { connect } from '../config/db/connect.js';

// Mostrar todas las razas de guerreros
export const showRaces = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM races"; // Selecciona todas las razas de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve las razas de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo razas de guerreros", details: error.message });
  }
};

// Mostrar una raza de guerrero por ID
export const showRacesId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM races WHERE id = ?"; // Selecciona una raza de guerrero específica
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Raza de guerrero no encontrada" });
    res.status(200).json(result[0]); // Devuelve la raza de guerrero encontrada
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo raza de guerrero", details: error.message });
  }
};

// Registrar una nueva raza de guerrero
export const addRaces = async (req, res) => {
  try {
    const { name, description } = req.body; // Datos necesarios para registrar la raza de guerrero
    if (!name || !description) {
      return res.status(400).json({ error: "Faltan campos obligatorios para la raza de guerrero" });
    }

    const sqlQuery = "INSERT INTO races (name, description) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [name, description]);

    res.status(201).json({
      message: "Raza de guerrero añadida exitosamente",
      data: { id: result.insertId, name, description }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo raza de guerrero", details: error.message });
  }
};

// Actualizar una raza de guerrero por ID
export const updateRaces = async (req, res) => {
  try {
    const { name, description } = req.body; // Datos necesarios para actualizar la raza de guerrero
    if (!name || !description) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar la raza de guerrero" });
    }

    const sqlQuery = "UPDATE races SET name=?, description=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [name, description, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Raza de guerrero no encontrada" });

    res.status(200).json({
      message: "Raza de guerrero actualizada exitosamente",
      data: { name, description }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando raza de guerrero", details: error.message });
  }
};

// Eliminar una raza de guerrero por ID
export const deleteRaces = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM races WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Raza de guerrero no encontrada" });

    res.status(200).json({
      message: "Raza de guerrero eliminada exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando raza de guerrero", details: error.message });
  }
};