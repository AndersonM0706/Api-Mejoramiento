import { connect } from '../config/db/connect.js';

// Mostrar todos los usuarios de guerreros
export const showUsers = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM users"; // Consulta para obtener todos los usuarios de guerreros
    const [result] = await connect.query(sqlQuery);
    res.status(200).json(result); // Devuelve la lista de usuarios de guerreros
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo usuarios de guerreros", details: error.message });
  }
};

// Mostrar un usuario de guerrero por ID
export const showUserId = async (req, res) => {
  try {
    const sqlQuery = "SELECT * FROM users WHERE id = ?"; // Consulta para obtener un usuario de guerrero específico
    const [result] = await connect.query(sqlQuery, [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: "Usuario de guerrero no encontrado" });
    res.status(200).json(result[0]); // Devuelve el usuario de guerrero encontrado
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo usuario de guerrero", details: error.message });
  }
};

// Crear un nuevo usuario guerrero
export const addUsers = async (req, res) => {
  try {
    const { username, password, email } = req.body; // Datos necesarios para registrar el usuario guerrero
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Faltan campos obligatorios para el usuario guerrero" });
    }

    const sqlQuery = "INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, NOW())";
    const [result] = await connect.query(sqlQuery, [username, password, email]);

    res.status(201).json({
      message: "Usuario guerrero añadido exitosamente",
      data: { id: result.insertId, username, email }
    });
  } catch (error) {
    res.status(500).json({ error: "Error añadiendo usuario guerrero", details: error.message });
  }
};

// Actualizar un usuario guerrero por ID
export const updateUsers = async (req, res) => {
  try {
    const { username, email } = req.body; // Datos necesarios para actualizar el usuario guerrero
    if (!username || !email) {
      return res.status(400).json({ error: "Faltan campos obligatorios para el usuario guerrero" });
    }

    const sqlQuery = "UPDATE users SET username=?, email=?, updated_at=NOW() WHERE id=?";
    const [result] = await connect.query(sqlQuery, [username, email, req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario guerrero no encontrado" });

    res.status(200).json({
      message: "Usuario guerrero actualizado exitosamente",
      data: { username, email }
    });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando usuario guerrero", details: error.message });
  }
};

// Eliminar un usuario guerrero por ID
export const deleteUsers = async (req, res) => {
  try {
    const sqlQuery = "DELETE FROM users WHERE id=?";
    const [result] = await connect.query(sqlQuery, [req.params.id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario guerrero no encontrado" });

    res.status(200).json({
      message: "Usuario guerrero eliminado exitosamente",
      deleted: result.affectedRows
    });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando usuario guerrero", details: error.message });
  }
};