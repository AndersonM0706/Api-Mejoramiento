const jwt = require('jsonwebtoken');
const pool = require('../config/database'); // Importa tu conexión a la base de datos

const JWT_SECRET = 'AndMor06'; // ¡NUNCA EN PRODUCCIÓN!

exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Aquí deberías realizar la lógica para verificar las credenciales del usuario
    // consultando tu base de datos. Este es un ejemplo SIMPLIFICADO.
    try {
        const [rows] = await pool.execute(
            'SELECT id, username, role FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {
            const user = rows[0];
            // Generar el token JWT
            const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas.' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al autenticar al usuario.' });
    }
};

// ELIMINA la función authenticateToken de aquí, ya está en authMiddleware.js