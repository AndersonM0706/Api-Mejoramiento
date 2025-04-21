const pool = require('../config/database');

/**
 * @route POST /teachers
 * @group Teachers - Operaciones relacionadas con los profesores
 * @param {Teacher.model} teacher.body.required - Datos para crear un nuevo profesor
 * @returns {Teacher} 201 - El profesor recién creado
 * @returns {Error} 400 - Todos los campos (documento, nombre, edad, especialidad) son requeridos
 * @returns {Error} 500 - Error al crear el profesor en la base de datos
 */
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

/**
 * @route GET /teachers
 * @group Teachers - Operaciones relacionadas con los profesores
 * @returns {Array<Teacher>} 200 - Un array de todos los profesores
 * @returns {Error} 500 - Error al obtener los profesores de la base de datos
 */
exports.getAllTeachers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, document, name, age, specialty FROM teachers');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        res.status(500).json({ message: 'Error al obtener los profesores de la base de datos.' });
    }
};

/**
 * @route GET /teachers/{id}
 * @group Teachers - Operaciones relacionadas con los profesores
 * @param {number} id.path.required - ID del profesor a obtener
 * @returns {Teacher} 200 - El profesor encontrado
 * @returns {Error} 404 - Profesor no encontrado
 * @returns {Error} 500 - Error al obtener el profesor de la base de datos
 */
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

/**
 * @route PUT /teachers/{id}
 * @group Teachers - Operaciones relacionadas con los profesores
 * @param {number} id.path.required - ID del profesor a actualizar
 * @param {Teacher.model} teacher.body.required - Datos para actualizar el profesor
 * @returns {Teacher} 200 - El profesor actualizado
 * @returns {Error} 400 - Todos los campos (documento, nombre, edad, especialidad) son requeridos para la actualización
 * @returns {Error} 404 - Profesor no encontrado
 * @returns {Error} 500 - Error al actualizar el profesor en la base de datos
 */
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

/**
 * @route DELETE /teachers/{id}
 * @group Teachers - Operaciones relacionadas con los profesores
 * @param {number} id.path.required - ID del profesor a eliminar
 * @returns {null} 204 - Profesor eliminado exitosamente
 * @returns {Error} 404 - Profesor no encontrado
 * @returns {Error} 500 - Error al eliminar el profesor de la base de datos
 */
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

/**
 * @route GET /teachers/{id}/info
 * @group Teachers - Operaciones relacionadas con los profesores
 * @param {number} id.path.required - ID del profesor para obtener información
 * @returns {Teacher} 200 - Información del profesor
 * @returns {Error} 404 - Profesor no encontrado
 * @returns {Error} 500 - Error al obtener la información del profesor de la base de datos
 */
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

/**
 * @route POST /teachers/{id}/teach
 * @group Teachers - Operaciones relacionadas con los profesores
 * @param {number} id.path.required - ID del profesor que va a enseñar
 * @returns {string} 200 - Mensaje indicando lo que enseña el profesor
 * @returns {Error} 404 - Profesor no encontrado
 * @returns {Error} 500 - Error al simular la enseñanza del profesor desde la base de datos
 */
exports.teach = async (req, res) => {
    const teacherId = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute('SELECT name, specialty FROM teachers WHERE id = ?', [teacherId]);
        if (rows.length > 0) {
            const teacher = { name: rows[0].name, specialty: rows[0].specialty, teach: function() { return `${this.name} está enseñando ${this.specialty}.`; } };
            res.status(200).send(teacher.teach());
        } else {
            res.status(404).json({ message: 'Profesor no encontrado.' });
        }
    } catch (error) {
        console.error('Error al simular la enseñanza del profesor:', error);
        res.status(500).json({ message: 'Error al simular la enseñanza del profesor desde la base de datos.' });
    }
};

/**
 * @typedef Teacher
 * @property {number} id
 * @property {string} document.required
 * @property {string} name.required
 * @property {integer} age.required
 * @property {string} specialty.required
 */