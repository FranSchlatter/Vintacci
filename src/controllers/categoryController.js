// src/controllers/categoryController.js
const { Category, Product } = require('../models');

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll({ // Podria incluir tags y products.
                include: [{
                    model: Category,
                    as: 'subcategories',
                    include: ['subcategories'] // Para categorías anidadas
                }],
                where: {
                    parent_id: null // Solo categorías principales (con sus subs). Sino se repiten las subs.
                }
            });
            res.json(categories);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener categorías');
        }
    },

    getAllCategoriesSimple: async (req, res) => {
        try {
            const categories = await Category.findAll({ // Podria incluir tags y products.
                include: [{
                    model: Category,
                    as: 'subcategories',
                    attributes: ['name', 'description'],
                    include: ['subcategories'] // Para categorías anidadas
                }],
                where: {
                    parent_id: null // Solo categorías principales (con sus subs). Sino se repiten las subs.
                },
                attributes: ['name', 'description']
            });
            res.json(categories);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener categorías');
        }
    },

    createCategory: async (req, res) => {
        const { name, description, parent_id } = req.body;

        if (!name) {
            return res.status(400).send('El nombre es obligatorio');
        }

        try {
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const newCategory = await Category.create({
                parent_id,
                name,
                description,
                slug
            });
            res.status(201).json(newCategory);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al crear categoría');
        }
    },

    updateCategory: async (req, res) => {
        const { id } = req.params;
        const { name, description, parent_id } = req.body;

        try {
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).send('Categoría no encontrada');
            }

            const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : category.slug;
            const updatedCategory = await category.update({
                parent_id,
                name: name || category.name,
                description,
                slug
            });

            res.json(updatedCategory);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar categoría');
        }
    },

    deleteCategory: async (req, res) => {
        const { id } = req.params;

        try {
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).send('Categoría no encontrada');
            }

            // Verificar si hay productos asociados // TODO categoryId?
            const productsCount = await Product.count({ where: { categoryId: id } });
            if (productsCount > 0) {
                return res.status(400).send('No se puede eliminar una categoría con productos asociados');
            }

            await category.destroy();
            res.status(204).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar categoría');
        }
    }
};

module.exports = categoryController