const Course = require('../models/course');

// Simulación de base de datos en memoria
let courses = [];
let nextCourseId = 1;

// Controlador para crear un nuevo curso
exports.createCourse = (req, res) => {
    const { name, teacher } = req.body; // Solo necesitamos 'name' y opcionalmente 'teacher'
    if (!name) {
        return res.status(400).json({ message: 'El nombre del curso es requerido.' });
    }
    const newCourse = new Course(nextCourseId++, name, teacher);
    courses.push(newCourse);
    res.status(201).json(newCourse);
};

// Controlador para obtener la lista de todos los cursos
exports.getAllCourses = (req, res) => {
    res.status(200).json(courses);
};

// Controlador para obtener un curso por su ID
exports.getCourseById = (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId); // Cambié 'p' a 'c' para mayor claridad
    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: 'Curso no encontrado.' });
    }
};

// Controlador para actualizar la información de un curso
exports.updateCourse = (req, res) => {
    const courseId = parseInt(req.params.id);
    const { name, teacher } = req.body; // Solo permitimos actualizar 'name' y 'teacher' por ahora
    const courseIndex = courses.findIndex(c => c.id === courseId); // Cambié 'p' a 'c'
    if (courseIndex !== -1) {
        courses[courseIndex] = { ...courses[courseIndex], name, teacher };
        res.status(200).json(courses[courseIndex]);
    } else {
        res.status(404).json({ message: 'Curso no encontrado.' });
    }
};

// Controlador para eliminar un curso
exports.deleteCourse = (req, res) => {
    const courseId = parseInt(req.params.id);
    const initialLength = courses.length;
    courses = courses.filter(c => c.id !== courseId); // Cambié 'p' a 'c'
    if (courses.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Curso no encontrado.' });
    }
};

// Controlador para agregar un estudiante a un curso
exports.addStudent = (req, res) => {
    const courseId = parseInt(req.params.id);
    const { studentId } = req.body; // Esperamos el ID del estudiante a agregar
    const course = courses.find(c => c.id === courseId);
    // **Aquí necesitaríamos lógica para encontrar al estudiante real (en nuestro array 'students')**
    // Por ahora, vamos a simular que el estudiante existe.
    const studentToAdd = { id: studentId }; // Simulación de un estudiante

    if (course) {
        course.addStudent(studentToAdd);
        res.status(200).json(course);
    } else {
        res.status(404).json({ message: 'Curso no encontrado.' });
    }
};

// Controlador para obtener información detallada del curso
exports.getCourseInfo = (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    if (course) {
        res.status(200).json(course.getCourseInfo());
    } else {
        res.status(404).json({ message: 'Curso no encontrado.' });
    }
};
const pool = require('../config/database');

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

exports.getAllCourses = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM courses');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        res.status(500).json({ message: 'Error al obtener los cursos de la base de datos.' });
    }
};

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

exports.addStudent = async (req, res) => {
    const courseId = parseInt(req.params.id);
    const { studentId } = req.body;

    try {
        // Verificar si el curso y el estudiante existen
        const [courseRows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
        const [studentRows] = await pool.execute('SELECT * FROM students WHERE id = ?', [studentId]);

        if (courseRows.length === 0) {
            return res.status(404).json({ message: 'Curso no encontrado.' });
        }
        if (studentRows.length === 0) {
            return res.status(404).json({ message: 'Estudiante no encontrado.' });
        }

        // Insertar en una tabla de relación muchos-a-muchos (course_students)
        await pool.execute('INSERT INTO course_students (course_id, student_id) VALUES (?, ?)', [courseId, studentId]);

        // Obtener la información actualizada del curso (opcional)
        const [updatedCourseRows] = await pool.execute('SELECT * FROM courses WHERE id = ?', [courseId]);
        res.status(200).json(updatedCourseRows[0]);

    } catch (error) {
        console.error('Error al agregar estudiante al curso:', error);
        res.status(500).json({ message: 'Error al agregar el estudiante al curso en la base de datos.' });
    }
};

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