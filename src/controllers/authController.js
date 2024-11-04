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
                dni
            } = req.body;
    
            if (!username || !email || !password || !first_name || !last_name || !dni) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }
    
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{ email }, { username }]
                }
            });
    
            if (existingUser) {
                return res.status(400).json({ error: 'Usuario ya existe' });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                first_name,
                last_name,
                dni,
                role: 'user'
            });
    
            const { password: _, ...userWithoutPassword } = user.toJSON();
    
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ error: 'Error en el registro' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email y contraseña son requeridos' });
            }

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            await user.update({ last_login: new Date() });

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            const { password: _, ...userWithoutPassword } = user.toJSON();

            res.json({
                user: userWithoutPassword,
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Error en el login' });
        }
    },

    getMe: async (req, res) => {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(user);
        } catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({ error: 'Error al obtener información del usuario' });
        }
    }
};

module.exports = authController;