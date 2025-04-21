const pool = require('../config/database');

/**
 * @route POST /courses
 * @group Courses - Operaciones relacionadas con los cursos
 * @param {Course.model} course.body.required - Datos para crear un nuevo curso
 * @returns {Course} 201 - El curso recién creado
 * @returns {Error} 400 - El nombre del curso es requerido
 * @returns {Error} 500 - Error al crear el curso en la base de datos
 */
exports.createCourse = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'El nombre del curso es requerido.' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO courses (name) VALUES (?)',
            [name]
        );

        const courseId = result.insertId;
        const [newCourse] = await pool.execute(
            'SELECT * FROM courses WHERE id = ?',
            [courseId]
        );

        res.status(201).json(newCourse[0]);

    } catch (error) {
        console.error('Error al crear curso:', error);
        res.status(500).json({ message: 'Error al crear el curso en la base de datos.' });
    }
};

/**
 * @route GET /courses
 * @group Courses - Operaciones relacionadas con los cursos
 * @returns {Array<Course>} 200 - Un array de todos los cursos
 * @returns {Error} 500 - Error al obtener los cursos de la base de datos
 */
exports.getAllCourses = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM courses');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ message: 'Error al obtener los cursos de la base de datos.' });
    }
};

/**
 * @route GET /courses/{id}
 * @group Courses - Operaciones relacionadas con los cursos
 * @param {number} id.path.required - ID del curso a obtener
 * @returns {Course} 200 - El curso encontrado
 * @returns {Error} 404 - Curso no encontrado
 * @returns {Error} 500 - Error al obtener el curso de la base de datos
 */
exports.getCourseById = async (req, res) => {
    const courseId = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Curso no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener curso por ID:', error);
        res.status(500).json({ message: 'Error al obtener el curso de la base de datos.' });
    }
};

/**
 * @route PUT /courses/{id}
 * @group Courses - Operaciones relacionadas con los cursos
 * @param {number} id.path.required - ID del curso a actualizar
 * @param {Course.model} course.body.required - Datos para actualizar el curso
 * @returns {Course} 200 - El curso actualizado
 * @returns {Error} 400 - El nombre del curso es requerido para la actualización
 * @returns {Error} 404 - Curso no encontrado
 * @returns {Error} 500 - Error al actualizar el curso en la base de datos
 */
exports.updateCourse = async (req, res) => {
    const courseId = parseInt(req.params.id);
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'El nombre del curso es requerido para la actualización.' });
    }
    try {
        const [result] = await pool.execute(
            'UPDATE courses SET name = ? WHERE id = ?',
            [name, courseId]
        );
        if (result.affectedRows > 0) {
            const [updatedCourse] = await pool.execute(
                'SELECT * FROM courses WHERE id = ?',
                [courseId]
            );
            res.status(200).json(updatedCourse[0]);
        } else {
            res.status(404).json({ message: 'Curso no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar curso:', error);
        res.status(500).json({ message: 'Error al actualizar el curso en la base de datos.' });
    }
};

/**
 * @route DELETE /courses/{id}
 * @group Courses - Operaciones relacionadas con los cursos
 * @param {number} id.path.required - ID del curso a eliminar
 * @returns {null} 204 - Curso eliminado exitosamente
 * @returns {Error} 404 - Curso no encontrado
 * @returns {Error} 500 - Error al eliminar el curso de la base de datos
 */
exports.deleteCourse = async (req, res) => {
    const courseId = parseInt(req.params.id);
    try {
        const [result] = await pool.execute('DELETE FROM courses WHERE id = ?', [courseId]);
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Curso no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar curso:', error);
        res.status(500).json({ message: 'Error al eliminar el curso de la base de datos.' });
    }
};

/**
 * @route POST /courses/{id}/students
 * @group Courses - Operaciones relacionadas con los cursos
 * @param {number} id.path.required - ID del curso al que se agregará el estudiante
 * @param {object} body.required - Objeto con el ID del estudiante
 * @param {number} body.studentId.required - ID del estudiante a agregar
 * @returns {Course} 200 - El curso actualizado con el estudiante agregado
 * @returns {Error} 404 - Curso o estudiante no encontrado
 * @returns {Error} 500 - Error al agregar el estudiante al curso en la base de datos
 */
exports.addStudent = async (req, res) => {
    const courseId = parseInt(req.params.id);
    const { studentId } = req.body;

    try {
        const [courseRows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
        const [studentRows] = await pool.execute('SELECT * FROM students WHERE id = ?', [studentId]);

        if (courseRows.length === 0) {
            return res.status(404).json({ message: 'Curso no encontrado.' });
        }
        if (studentRows.length === 0) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        await pool.execute('INSERT INTO course_students (course_id, student_id) VALUES (?, ?)', [courseId, studentId]);

        const [updatedCourseRows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
        res.status(200).json(updatedCourseRows[0]);

    } catch (error) {
        console.error('Error al agregar estudiante al curso:', error);
        res.status(500).json({ message: 'Error al agregar el estudiante al curso en la base de datos.' });
    }
};

/**
 * @route GET /courses/{id}/info
 * @group Courses - Operaciones relacionadas con los cursos
 * @param {number} id.path.required - ID del curso para obtener información detallada
 * @returns {object} 200 - Información detallada del curso con la lista de estudiantes
 * @returns {Error} 404 - Curso no encontrado
 * @returns {Error} 500 - Error al obtener la información del curso de la base de datos
 */
exports.getCourseInfo = async (req, res) => {
    const courseId = parseInt(req.params.id);
    try {
        const [rows] = await pool.execute(`
            SELECT c.id, c.name,
                GROUP_CONCAT(s.id SEPARATOR ',') AS student_ids,
                GROUP_CONCAT(s.name SEPARATOR ',') AS student_names
            FROM courses c
            LEFT JOIN course_students cs ON c.id = cs.course_id
            LEFT JOIN students s ON cs.student_id = s.id
            WHERE c.id = ?
            GROUP BY c.id, c.name
        `, [courseId]);

        if (rows.length > 0) {
            const courseInfo = {
                id: rows[0].id,
                name: rows[0].name,
                students: rows[0].student_ids ? rows[0].student_ids.split(',').map((id, index) => ({
                    id: parseInt(id),
                    name: rows[0].student_names.split(',')[index]
                })) : []
            };
            res.status(200).json(courseInfo);
        } else {
            res.status(404).json({ message: 'Curso no encontrado.' });
        }
    } catch (error) {
        console.error('Error al obtener información del curso:', error);
        res.status(500).json({ message: 'Error al obtener la información del curso de la base de datos.' });
    }
};

/**
 * @typedef Course
 * @property {number} id
 * @property {string} name.required
 * @property {string} teacher
 */