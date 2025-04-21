const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerOptions');
const authController = require('./controllers/authController'); // Importa el controlador de autenticación
const authMiddleware = require('./middleware/authMiddleware'); // Importa el middleware de autenticación
const cors = require('cors'); // Importa el middleware cors

console.log("Contenido de swaggerSpec:", swaggerSpec);

const studentController = require('./controllers/studentController');
console.log("Valor de studentController:", studentController); // AGREGADO PARA DEBUGGING
const courseController = require('./controllers/courseController');
const teacherController = require('./controllers/teacherController');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Configura CORS para permitir peticiones desde tu frontend
app.use(cors({
    origin: 'http://localhost:3001', // Permite solo este origen
    methods: 'GET,HEAD,PUT,POST,DELETE', // Métodos HTTP permitidos
    credentials: true // Permite el envío de cookies de origen cruzado (si es necesario)
}));

// Ruta de Login (para obtener el token)
app.post('/login', authController.login);

// Rutas para Student (algunas protegidas)
app.post('/students', authMiddleware, studentController.createStudent); // Protegida
app.get('/students', studentController.getAllStudents);
app.get('/students/:id', studentController.getStudentById);
app.put('/students/:id', authMiddleware, studentController.updateStudent); // Protegida
app.delete('/students/:id', authMiddleware, studentController.deleteStudent); // Protegida
app.put('/students/:id/course', authMiddleware, studentController.setCourse); // Protegida
app.get('/students/:id/info', studentController.getStudentInfo);
app.post('/students/:id/study', studentController.study); // ¿Debería estar protegida? Depende de la lógica

// Rutas para Course (algunas protegidas)
app.post('/courses', authMiddleware, courseController.createCourse); // Protegida
app.get('/courses', courseController.getAllCourses);
app.get('/courses/:id', courseController.getCourseById);
app.put('/courses/:id', authMiddleware, courseController.updateCourse); // Protegida
app.delete('/courses/:id', authMiddleware, courseController.deleteCourse); // Protegida
app.post('/courses/:id/students', authMiddleware, courseController.addStudent); // Protegida
app.get('/courses/:id/info', courseController.getCourseInfo);

// Rutas para Teacher (algunas protegidas)
app.post('/teachers', authMiddleware, teacherController.createTeacher); // Protegida
app.get('/teachers', teacherController.getAllTeachers);
app.get('/teachers/:id', teacherController.getTeacherById);
app.put('/teachers/:id', authMiddleware, teacherController.updateTeacher); // Protegida
app.delete('/teachers/:id', authMiddleware, teacherController.deleteTeacher); // Protegida
app.get('/teachers/:id/info', teacherController.getTeacherInfo);
app.post('/teachers/:id/teach', authMiddleware, teacherController.teach); // ¿Debería estar protegida? Depende de la lógica

// Configuración de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
});