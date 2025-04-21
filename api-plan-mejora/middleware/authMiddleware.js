const jwt = require('jsonwebtoken');

const JWT_SECRET = 'AndMor06'; // ¡NUNCA EN PRODUCCIÓN!

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (token == null) {
        return res.sendStatus(401); // No autorizado
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Token inválido (Forbidden)
        }
        req.user = user; // Agrega la información del usuario al objeto de la solicitud

        // Lógica de autorización PARA LA ELIMINACIÓN DE ESTUDIANTES (ejemplo)
        if (req.method === 'DELETE' && req.path.startsWith('/students/')) {
            if (req.user.role !== 'admin') {
                return res.sendStatus(403); // Prohibido si no es administrador para eliminar
            }
        }

        next(); // Continúa con el siguiente middleware o ruta
    });
};

module.exports = authenticateToken;