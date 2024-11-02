// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Obtener token del header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: 'Acceso denegado. Token no proporcionado.' 
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregar usuario al request
        req.user = decoded;
        
        next();
    } catch (error) {
        res.status(401).json({ 
            error: 'Token inválido' 
        });
    }
};

module.exports = authMiddleware;