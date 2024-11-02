// src/controllers/addressController.js
const { Address } = require('../models');

const addressController = {
    // Obtener todas las direcciones de un usuario
    getUserAddresses: async (req, res) => {
        try {
            const addresses = await Address.findAll({
                where: { user_id: req.params.userId },
                order: [['is_default', 'DESC']]
            });
            res.json(addresses);
        } catch (err) {
            console.error('Error getting addresses:', err);
            res.status(500).json({ error: 'Error al obtener las direcciones' });
        }
    },

    // Agregar nueva dirección
    addAddress: async (req, res) => {
        try {
            const { userId } = req.params;
            const addressData = req.body;

            // Si es la primera dirección o se marca como predeterminada
            if (addressData.is_default) {
                // Quitar el estado predeterminado de otras direcciones
                await Address.update(
                    { is_default: false },
                    { where: { user_id: userId } }
                );
            }

            const address = await Address.create({
                ...addressData,
                user_id: userId
            });

            res.status(201).json(address);
        } catch (err) {
            console.error('Error adding address:', err);
            res.status(500).json({ error: 'Error al agregar la dirección' });
        }
    },

    // Actualizar dirección
    updateAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const addressData = req.body;

            const address = await Address.findByPk(id);
            if (!address) {
                return res.status(404).json({ error: 'Dirección no encontrada' });
            }

            if (addressData.is_default) {
                await Address.update(
                    { is_default: false },
                    { where: { user_id: address.user_id } }
                );
            }

            await address.update(addressData);
            res.json(address);
        } catch (err) {
            console.error('Error updating address:', err);
            res.status(500).json({ error: 'Error al actualizar la dirección' });
        }
    },

    // Eliminar dirección
    deleteAddress: async (req, res) => {
        try {
            const { id } = req.params;
            const address = await Address.findByPk(id);
            
            if (!address) {
                return res.status(404).json({ error: 'Dirección no encontrada' });
            }

            await address.destroy();
            res.status(204).send();
        } catch (err) {
            console.error('Error deleting address:', err);
            res.status(500).json({ error: 'Error al eliminar la dirección' });
        }
    },

    // Establecer dirección como predeterminada
    setDefaultAddress: async (req, res) => {
        try {
            const { id, userId } = req.params;

            // Quitar el estado predeterminado de todas las direcciones del usuario
            await Address.update(
                { is_default: false },
                { where: { user_id: userId } }
            );

            // Establecer la nueva dirección predeterminada
            const address = await Address.findByPk(id);
            if (!address) {
                return res.status(404).json({ error: 'Dirección no encontrada' });
            }

            await address.update({ is_default: true });
            res.json(address);
        } catch (err) {
            console.error('Error setting default address:', err);
            res.status(500).json({ error: 'Error al establecer la dirección predeterminada' });
        }
    }
};

module.exports = addressController;