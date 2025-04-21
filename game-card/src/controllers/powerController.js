import { connect } from '../config/db/connect.js';

// Mostrar todos los poderes de guerreros
export const showPower = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM power"; // Selecciona todos los poderes de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve los poderes de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo poderes de guerreros", details: error.message });
  }
};

// Mostrar un poder de guerrero por ID
export const showPowerId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM power WHERE id = ?"; // Selecciona un poder de guerrero específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Poder de guerrero no encontrado" });
    res.status(200).json(result[0]); // Devuelve el poder de guerrero encontrado
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo poder de guerrero", details: error.message });
  }
};

// Registrar un nuevo poder de guerrero
export const addPower = async (req, res) => {
  try {
    const { type, value } = req.body; // Datos necesarios para registrar el poder de guerrero
    if (!type || !value) {
      return res.status(400).json({ error: "Faltan campos obligatorios para el poder de guerrero" });
    }

    const sqlQuery = "INSERT INTO power (type, value) VALUES (?, ?)";
    const [result] = await connect.query(sqlQuery, [type, value]);

    res.status(201).json({
      message: "Poder de guerrero añadido exitosamente",
      data: { id: result.insertId, type, value }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo poder de guerrero", details: error.message });
  }
};

// Actualizar un poder de guerrero por ID
export const updatePower = async (req, res) => {
  try {
    const { type, value } = req.body; // Datos necesarios para actualizar el poder de guerrero
    if (!type || !value) {
      return res.status(400).json({ error: "Faltan campos obligatorios para actualizar el poder de guerrero" });
    }

    const sqlQuery = "UPDATE power SET type=?, value=? WHERE id=?";
    const [result] = await connect.query(sqlQuery, [type, value, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Poder de guerrero no encontrado" });

    res.status(200).json({
      message: "Poder de guerrero actualizado exitosamente",
      data: { type, value }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando poder de guerrero", details: error.message });
  }
};

// Eliminar un poder de guerrero por ID
export const deletePower = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM power WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Poder de guerrero no encontrado" });

    res.status(200).json({
      message: "Poder de guerrero eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando poder de guerrero", details: error.message });
  }
};