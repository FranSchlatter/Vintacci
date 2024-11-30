// src/controllers/categoryController.js
const { Category, Product } = require('../models');

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll({
                include: [{
                    model: Category,
                    as: 'subcategories',
                    include: ['subcategories'] // Para categorías anidadas
                }],
                where: {
                    parentId: null // Solo categorías principales
                }
            });
            res.json(categories);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener categorías');
        }
    },

    createCategory: async (req, res) => {
        const { name, description, parentId = null } = req.body;

        if (!name) {
            return res.status(400).send('El nombre es obligatorio');
        }

        try {
            const slug = name.toLowerCase().replace(/\s+/g, '-');
            const newCategory = await Category.create({
                name,
                description,
                parentId,
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
        const { name, description, parentId } = req.body;

        try {
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).send('Categoría no encontrada');
            }

            const slug = name ? name.toLowerCase().replace(/\s+/g, '-') : category.slug;
            const updatedCategory = await category.update({
                name: name || category.name,
                description,
                parentId,
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

            // Verificar si hay productos asociados
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