const { User } = require('../models');
const bcrypt = require('bcryptjs'); // Necesario para hashear passwords

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll({
                attributes: { exclude: ['password'] }
            });
            res.json(users);
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    },

    createUser: async (req, res) => {
        try {
            const { 
                username, 
                email, 
                password,
                role,
                first_name, 
                last_name,
                dni,
                phone,
                birth_date,
                preferences,
                newsletter_subscription
            } = req.body;

            if (!username || !email || !password || !role || !first_name || !last_name || !dni) {
                return res.status(400).json({ error: 'Faltan campos requeridos' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                role,
                first_name,
                last_name,
                dni,
                phone,
                birth_date,
                preferences,
                newsletter_subscription,
                status: 'active'
            });

            const { password: _, ...userWithoutPassword } = newUser.toJSON();
            res.status(201).json(userWithoutPassword);
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'El username o email ya está en uso' });
            }
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        const { 
            username,
            email,
            role,
            first_name,
            last_name,
            dni,
            phone,
            birth_date,
            preferences,
            newsletter_subscription,
            status,
            password // opcional
        } = req.body;

        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Si se proporciona nueva contraseña, hashearla
            const updateData = {
                username,
                email,
                role,
                first_name,
                last_name,
                dni,
                phone,
                birth_date,
                preferences,
                newsletter_subscription,
                status,
                ...(password && { password: await bcrypt.hash(password, 10) })
            };

            const updatedUser = await user.update(updateData);
            const { password: _, ...userWithoutPassword } = updatedUser.toJSON();

            res.json(userWithoutPassword);
        } catch (error) {
            console.error('Error updating user:', error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({ error: 'El username o email ya está en uso' });
            }
            res.status(500).json({ error: 'Error al actualizar usuario' });
        }
    },

    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            await user.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Error al eliminar usuario' });
        }
    },

    getUserById: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id, {
                attributes: { exclude: ['password'] },
                include: ['order']
            });
            
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(user);
        } catch (error) {
            console.error('Error getting user:', error);
            res.status(500).json({ error: 'Error al obtener usuario' });
        }
    },

    makeUserAdmin: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Verificar si ya es admin
            if (user.role === 'admin') {
                return res.status(400).json({ error: 'El usuario ya es administrador' });
            }

            // Actualizar a admin
            await user.update({ role: 'admin' });

            const { password: _, ...userWithoutPassword } = user.toJSON();
            res.json({
                message: 'Usuario actualizado a administrador exitosamente',
                user: userWithoutPassword
            });
        } catch (error) {
            console.error('Error making user admin:', error);
            res.status(500).json({ error: 'Error al convertir usuario en administrador' });
        }
    }
};

module.exports = userController;