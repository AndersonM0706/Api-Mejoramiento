const pool = require('../config/database');

/**
 * @route POST /students
 * @group Students - Operaciones relacionadas con los estudiantes
 * @param {Student.model} student.body.required - Datos para crear un nuevo estudiante
 * @returns {Student} 201 - El estudiante recién creado
 * @returns {Error} 400 - Todos los campos son requeridos
 * @returns {Error} 500 - Error al crear el estudiante en la base de datos
 */
exports.createStudent = async (req, res) => {
    const { document, name, age } = req.body;
    if (!document || !name || !age) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO students (document, name, age) VALUES (?, ?, ?)',
            [document, name, age]
        );

        const studentId = result.insertId;
        const [newStudent] = await pool.execute(
            'SELECT * FROM students WHERE id = ?',
            [studentId]
        );

        res.status(201).json(newStudent[0]);

    } catch (error) {
        console.error('Error al crear estudiante:', error);
        res.status(500).json({ message: 'Error al crear el estudiante en la base de datos.' });
    }
};

/**
 * @route GET /students
 * @group Students - Operaciones relacionadas con los estudiantes
 * @returns {Array<Student>} 200 - Un array de todos los estudiantes
 * @returns {Error} 500 - Error al obtener los estudiantes de la base de datos
 */
exports.getAllStudents = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM students');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({ message: 'Error al obtener los estudiantes de la base de datos.' });
    }
};

/**
 * @route GET /students/{id}
 * @group Students - Operaciones relacionadas con los estudiantes
 * @param {number} id.path.required - ID del estudiante a obtener
 * @returns {StudentInfo} 200 - El estudiante encontrado con información del curso
 * @returns {Error} 404 - Estudiante no encontrado
 * @returns {Error} 500 - Error al obtener el estudiante de la base de datos
 */
exports.getStudentById = async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute(`
            SELECT s.id, s.document, s.name, s.age, c.id AS course_id, c.name AS course_name
            FROM students s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `, [studentId]);

        if (rows.length > 0) {
            const studentInfo = {
                id: rows[0].id,
                document: rows[0].document,
                name: rows[0].name,
                age: rows[0].age,
                course: rows[0].course_id ? { id: rows[0].course_id, name: rows[0].course_name } : null
            };
            res.status(200).json(studentInfo);
        } else {
            res.status(404).json({ message: 'Estudiante no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener estudiante por ID:', error);
        res.status(500).json({ message: 'Error al obtener el estudiante de la base de datos.' });
    }
};

/**
 * @route PUT /students/{id}
 * @group Students - Operaciones relacionadas con los estudiantes
 * @param {number} id.path.required - ID del estudiante a actualizar
 * @param {Student.model} student.body.required - Datos para actualizar el estudiante
 * @returns {Student} 200 - El estudiante actualizado
 * @returns {Error} 400 - Todos los campos son requeridos para la actualización
 * @returns {Error} 404 - Estudiante no encontrado
 * @returns {Error} 500 - Error al actualizar el estudiante en la base de datos
 */
exports.updateStudent = async (req, res) => {
    const studentId = parseInt(req.params.id);
    const { document, name, age } = req.body;
    if (!document || !name || !age) {
        return res.status(400).json({ message: 'Todos los campos son requeridos para la actualización.' });
    }
    try {
        const [result] = await pool.execute(
            'UPDATE students SET document = ?, name = ?, age = ? WHERE id = ?',
            [document, name, age, studentId]
        );
        if (result.affectedRows > 0) {
            const [updatedStudent] = await pool.execute(
                'SELECT * FROM students WHERE id = ?',
                [studentId]
            );
            res.status(200).json(updatedStudent[0]);
        } else {
            res.status(404).json({ message: 'Estudiante no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
        res.status(500).json({ message: 'Error al actualizar el estudiante en la base de datos.' });
    }
};

/**
 * @route DELETE /students/{id}
 * @group Students - Operaciones relacionadas con los estudiantes
 * @param {number} id.path.required - ID del estudiante a eliminar
 * @returns {null} 204 - Estudiante eliminado exitosamente
 * @returns {Error} 404 - Estudiante no encontrado
 * @returns {Error} 500 - Error al eliminar el estudiante de la base de datos
 */
exports.deleteStudent = async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [studentId]);
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Estudiante no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({ message: 'Error al eliminar el estudiante de la base de datos.' });
    }
};

/**
 * @route PUT /students/{id}/course
 * @group Students - Operaciones relacionadas con los estudiantes
 * @param {number} id.path.required - ID del estudiante al que se asignará el curso
 * @param {object} body.required - Objeto con el ID del curso
 * @param {number} body.courseId.required - ID del curso a asignar
 * @returns {Student} 200 - El estudiante actualizado con el ID del curso asignado
 * @returns {Error} 404 - Estudiante o curso no encontrado
 * @returns {Error} 500 - Error al asignar el curso al estudiante en la base de datos
 */
exports.setCourse = async (req, res) => {
    const studentId = parseInt(req.params.id);
    const { courseId } = req.body;

    try {
        const [studentRows] = await pool.execute('SELECT * FROM students WHERE id = ?', [studentId]);
        if (studentRows.length === 0) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        const [courseRows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
        if (courseRows.length === 0) {
            return res.status(404).json({ message: 'Curso no encontrado.' });
        }

        await pool.execute('UPDATE students SET course_id = ? WHERE id = ?', [courseId, studentId]);

        const [updatedStudentRows] = await pool.execute('SELECT * FROM students WHERE id = ?', [studentId]);
        res.status(200).json(updatedStudentRows[0]);

    } catch (error) {
        console.error('Error al asignar curso al estudiante:', error);
        res.status(500).json({ message: 'Error al asignar el curso al estudiante en la base de datos.' });
    }
};

/**
 * @route GET /students/{id}/info
 * @group Students - Operaciones relacionadas con los estudiantes
 * @param {number} id.path.required - ID del estudiante para obtener información detallada
 * @returns {StudentInfo} 200 - Información detallada del estudiante con el curso asignado
 * @returns {Error} 404 - Estudiante no encontrado
 * @returns {Error} 500 - Error al obtener la información del estudiante de la base de datos
 */
exports.getStudentInfo = async (req, res) => {
    const studentId = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute(`
            SELECT s.id, s.document, s.name, s.age, c.id AS course_id, c.name AS course_name
            FROM students s
            LEFT JOIN courses c ON s.course_id = c.id
            WHERE s.id = ?
        `, [studentId]);

        if (rows.length > 0) {
            const studentInfo = {
                id: rows[0].id,
                document: rows[0].document,
                name: rows[0].name,
                age: rows[0].age,
                course: rows[0].course_id ? { id: rows[0].course_id, name: rows[0].course_name } : null
            };
            res.status(200).json(studentInfo);
        } else {
            res.status(404).json({ message: 'Estudiante no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener información del estudiante:', error);
        res.status(500).json({ message: 'Error al obtener la información del estudiante de la base de datos.' });
    }
};

/**
 * @
 * 
 const pool = require('../config/database');

/**
 * @route POST /students/{id}/study
 * @group Students - Operaciones relacionadas con los estudiantes
 * @param {number} id.path.required - ID del estudiante que va a estudiar
 * @returns {string} 200 - Mensaje indicando que el estudiante está estudiando
 * @returns {Error} 404 - Estudiante no encontrado
 */
exports.study = (req, res) => {
    const studentId = parseInt(req.params.id);
    res.status(200).send(`Estudiante con ID ${studentId} está estudiando.`);
};

/**
 * @typedef Student
 * @property {number} id
 * @property {string} document.required
 * @property {string} name.required
 * @property {integer} age.required
 * @property {number} course_id
 */

/**
 * @typedef StudentInfo
 * @property {number} id
 * @property {string} document
 * @property {string} name
 * @property {integer} age
 * @property {object} course
 * @property {number} course.id
 * @property {string} course.name
 */