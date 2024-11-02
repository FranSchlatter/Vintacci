// src/controllers/userController.js
const { User } = require('../models');

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener usuarios');
        }
    },

    createUser: async (req, res) => {
        const { 
            username, 
            email, 
            password, 
            role, 
            first_name, 
            last_name, 
            dni, 
            country, 
            city, 
            postal_code, 
            street, 
            height, 
            apartment 
        } = req.body;

        // Validación de datos
        if (!username || !email || !password || !role || !first_name || 
            !last_name || !dni || !country || !city || !postal_code || 
            !street || !height) {
            return res.status(400).send('Todos los campos son obligatorios excepto apartment');
        }

        try {
            const newUser = await User.create({
                username,
                email,
                password,
                role,
                first_name,
                last_name,
                dni,
                country,
                city,
                postal_code,
                street,
                height,
                apartment
            });
            res.status(201).json(newUser);
        } catch (err) {
            console.error('Error al registrar el usuario:', err.message);
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ 
                    error: 'Usuario ya existe',
                    details: 'El username o email ya está en uso'
                });
            }
            res.status(500).send('Error al registrar el usuario');
        }
    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        const { 
            role, 
            first_name, 
            last_name, 
            dni, 
            country, 
            city, 
            postal_code, 
            street, 
            height, 
            apartment, 
            username, 
            email, 
            password 
        } = req.body;

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            const updatedUser = await user.update({
                role,
                first_name,
                last_name,
                dni,
                country,
                city,
                postal_code,
                street,
                height,
                apartment,
                username,
                email,
                password
            });

            res.json(updatedUser);
        } catch (err) {
            console.error(err.message);
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ 
                    error: 'Error de actualización',
                    details: 'El username o email ya está en uso'
                });
            }
            res.status(500).send('Error al actualizar el usuario');
        }
    },

    deleteUser: async (req, res) => {
        const { id } = req.params;

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            await user.destroy();
            res.status(204).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar el usuario');
        }
    },

    getUserById: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id, {
                include: ['orders'] // Incluir órdenes asociadas si es necesario
            });
            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el usuario');
        }
    }
};

module.exports = userController;
