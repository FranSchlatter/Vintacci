const { User } = require('../models');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
    register: async (req, res) => {
        try {
            const { 
                username, 
                email, 
                password, 
                first_name, 
                last_name,
                dni,                    // Agregado
                phone,                  // Opcional
                birth_date,            // Opcional
                newsletter_subscription // Opcional
            } = req.body;

            // Validar campos requeridos
            if (!username || !email || !password || !first_name || !last_name || !dni) {
                return res.status(400).json({
                    error: 'Faltan campos requeridos: username, email, password, first_name, last_name y dni son obligatorios'
                });
            }

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{ email }, { username }]
                }
            });

            if (existingUser) {
                return res.status(400).json({ 
                    error: 'El email o username ya está en uso' 
                });
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Crear usuario con todos los campos
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                first_name,
                last_name,
                dni,
                phone: phone || null,
                birth_date: birth_date || null,
                newsletter_subscription: newsletter_subscription || false,
                role: 'user',
                status: 'active'
            });

            // Responder sin incluir la contraseña
            const { password: _, ...userWithoutPassword } = user.toJSON();

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Error en registro:', error);
            
            // Manejo específico de errores de Sequelize
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    error: 'Error de validación',
                    details: error.errors.map(err => ({
                        field: err.path,
                        message: err.message
                    }))
                });
            }

            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    error: 'Ya existe un usuario con ese email o username'
                });
            }

            res.status(500).json({ 
                error: 'Error al registrar usuario',
                details: error.message
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validar que se proporcionaron email y password
            if (!email || !password) {
                return res.status(400).json({
                    error: 'Email y contraseña son requeridos'
                });
            }

            // Buscar usuario
            const user = await User.findOne({ 
                where: { email } 
            });

            if (!user) {
                return res.status(401).json({ 
                    error: 'Credenciales inválidas' 
                });
            }

            // Verificar contraseña
            const isValidPassword = await bcrypt.compare(
                password, 
                user.password
            );

            if (!isValidPassword) {
                return res.status(401).json({ 
                    error: 'Credenciales inválidas' 
                });
            }

            // Verificar que existe JWT_SECRET
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET no está configurada');
                return res.status(500).json({
                    error: 'Error de configuración del servidor'
                });
            }

            // Actualizar último login
            await user.update({
                last_login: new Date()
            });

            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: user.id,
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Enviar respuesta sin la contraseña
            const { password: _, ...userWithoutPassword } = user.toJSON();

            res.json({
                user: userWithoutPassword,
                token
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ 
                error: 'Error al iniciar sesión',
                details: error.message
            });
        }
    },

    getMe: async (req, res) => {
        try {
            // El usuario ya viene del middleware auth
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({ 
                    error: 'Usuario no encontrado' 
                });
            }

            res.json(user);
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ 
                error: 'Error al obtener información del usuario',
                details: error.message
            });
        }
    }
};

module.exports = authController;