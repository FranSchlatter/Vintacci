// src/controllers/productOptionController.js
const { ProductOption } = require('../models');

const productOptionController = {
    getAllOptions: async (req, res) => {
        try {
            const options = await ProductOption.findAll();
            res.json(options);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener opciones');
        }
    },

    createOption: async (req, res) => {
        const { name, type, value } = req.body;

        if (!name || !type || !value) {
            return res.status(400).send('Nombre, tipo y valor son obligatorios');
        }

        try {
            const newOption = await ProductOption.create({
                name,
                type,
                value
            });
            res.status(201).json(newOption);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al crear opción');
        }
    },

    updateOption: async (req, res) => {
        const { id } = req.params;
        const { name, type, value } = req.body;

        try {
            const option = await ProductOption.findByPk(id);
            if (!option) {
                return res.status(404).send('Opción no encontrada');
            }

            const updatedOption = await option.update({
                name: name || option.name,
                type: type || option.type,
                value: value || option.value
            });

            res.json(updatedOption);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar opción');
        }
    },

    deleteOption: async (req, res) => {
        const { id } = req.params;

        try {
            const option = await ProductOption.findByPk(id);
            if (!option) {
                return res.status(404).send('Opción no encontrada');
            }

            // Verificar si hay variantes usando esta opción
            const variantsCount = await option.countProductVariants();
            if (variantsCount > 0) {
                return res.status(400).send('No se puede eliminar una opción que está en uso');
            }

            await option.destroy();
            res.status(204).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar opción');
        }
    },

    getOptionsByType: async (req, res) => {
        const { type } = req.params;
        try {
            const options = await ProductOption.findAll({
                where: { type }
            });
            res.json(options);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener opciones por tipo');
        }
    }
};

module.exports = productOptionController