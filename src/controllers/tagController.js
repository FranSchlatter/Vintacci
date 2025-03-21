// src/controllers/tagController.js
const { Tag, Product, Category } = require('../models');

const tagController = {
    getAllTags: async (req, res) => {
        try {
            const tags = await Tag.findAll({
                include: [{
                    model: Product,
                    as: "AssociatedToProd",
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                },
                {
                    model: Category,
                    as: "AssociatedToCat",
                    through: { attributes: [] },
                    attributes: ['id', 'name']
                }]
            });
            res.json(tags);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener tags');
        }
    },

    getAllTagsSimple: async (req, res) => {
        try {
            const tags = await Tag.findAll({
                attributes: ['name', 'type']
            });
            res.json(tags);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener tags');
        }
    },

    createTag: async (req, res) => { // TODO revisar category si no existe no crear tag.
        const { name, type, categoryPath } = req.body;

        if (!name || !type) {
            return res.status(400).send('Nombre y tipo son obligatorios');
        }

        try {
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const newTag = await Tag.create({
                name,
                type,
                slug
            });

            for (let i = 0; i < categoryPath.length; i++) {
                await newTag.addAssociatedToCat(categoryPath[i])
            }
            res.status(201).json(newTag);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al crear tag');
        }
    },

    updateTag: async (req, res) => { // TODO Puede cambiar de categories asociadas?
        const { id } = req.params;
        const { name, type } = req.body;

        try {
            const tag = await Tag.findByPk(id);
            if (!tag) {
                return res.status(404).send('Tag no encontrado');
            }

            const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : tag.slug;
            const updatedTag = await tag.update({
                name: name || tag.name,
                type: type || tag.type,
                slug
            });

            res.json(updatedTag);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar tag');
        }
    },

    deleteTag: async (req, res) => {
        const { id } = req.params;

        try {
            const tag = await Tag.findByPk(id);
            if (!tag) {
                return res.status(404).send('Tag no encontrado');
            }

            await tag.destroy();
            res.status(204).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar tag');
        }
    }
};

module.exports = tagController