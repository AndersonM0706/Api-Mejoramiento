const pool = require('../config/database');

exports.createTeacher = async (req, res) => {
    const { document, name, age, specialty } = req.body;
    if (!document || !name || !age || !specialty) {
        return res.status(400).json({ message: 'Todos los campos (documento, nombre, edad, especialidad) son requeridos.' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO teachers (document, name, age, specialty) VALUES (?, ?, ?, ?)',
            [document, name, age, specialty]
        );

        const teacherId = result.insertId;
        const [newTeacher] = await pool.execute(
            'SELECT id, document, name, age, specialty FROM teachers WHERE id = ?',
            [teacherId]
        );

        res.status(201).json(newTeacher[0]);

    } catch (error) {
        console.error('Error al crear profesor:', error);
        res.status(500).json({ message: 'Error al crear el profesor en la base de datos.' });
    }
};

exports.getAllTeachers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, document, name, age, specialty FROM teachers');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        res.status(500).json({ message: 'Error al obtener los profesores de la base de datos.' });
    }
};

exports.getTeacherById = async (req, res) => {
    const teacherId = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute('SELECT id, document, name, age, specialty FROM teachers WHERE id = ?', [teacherId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Profesor no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener profesor por ID:', error);
        res.status(500).json({ message: 'Error al obtener el profesor de la base de datos.' });
    }
};

exports.updateTeacher = async (req, res) => {
    const teacherId = parseInt(req.params.id);
    const { document, name, age, specialty } = req.body;
    if (!document || !name || !age || !specialty) {
        return res.status(400).json({ message: 'Todos los campos (documento, nombre, edad, especialidad) son requeridos para la actualización.' });
    }
    try {
        const [result] = await pool.execute(
            'UPDATE teachers SET document = ?, name = ?, age = ?, specialty = ? WHERE id = ?',
            [document, name, age, specialty, teacherId]
        );
        if (result.affectedRows > 0) {
            const [updatedTeacher] = await pool.execute(
                'SELECT id, document, name, age, specialty FROM teachers WHERE id = ?',
                [teacherId]
            );
            res.status(200).json(updatedTeacher[0]);
        } else {
            res.status(404).json({ message: 'Profesor no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar profesor:', error);
        res.status(500).json({ message: 'Error al actualizar el profesor en la base de datos.' });
    }
};

exports.deleteTeacher = async (req, res) => {
    const teacherId = parseInt(req.params.id);
    try {
        const [result] = await pool.execute('DELETE FROM teachers WHERE id = ?', [teacherId]);
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Profesor no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
        res.status(500).json({ message: 'Error al eliminar el profesor de la base de datos.' });
    }
};

exports.getTeacherInfo = async (req, res) => {
    const teacherId = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute('SELECT id, document, name, age, specialty FROM teachers WHERE id = ?', [teacherId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Profesor no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener información del profesor:', error);
        res.status(500).json({ message: 'Error al obtener la información del profesor de la base de datos.' });
    }
};

exports.teach = async (req, res) => {
    const teacherId = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute('SELECT name, specialty FROM teachers WHERE id = ?', [teacherId]);
        if (rows.length > 0) {
            const teacher = new Teacher(rows[0].id, null, rows[0].name, null, rows[0].specialty); // Creamos una instancia para usar el método teach
            res.status(200).send(teacher.teach());
        } else {
            res.status(404).json({ message: 'Profesor no encontrado.' });
        }
    } catch (error) {
        console.error('Error al simular la enseñanza del profesor:', error);
        res.status(500).json({ message: 'Error al simular la enseñanza del profesor desde la base de datos.' });
    }
};