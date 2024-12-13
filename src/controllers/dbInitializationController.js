// src/controllers/dbInitializationController.js
const { 
    Category, 
    Tag, 
    ProductOption, 
    Product, 
    ProductVariant 
} = require('../models');
const initialData = require('../data/initial-data.json');
const sequelize = require('../../db');
const { Op } = require('sequelize');

// Función auxiliar para generar el siguiente código de producto
const generateProductCode = async (prefix = 'PROD', transaction) => {
    const lastProduct = await Product.findOne({
        where: {
            productCode: {
                [Op.like]: `${prefix}%`
            }
        },
        order: [['productCode', 'DESC']],
        transaction
    });

    if (!lastProduct) {
        return `${prefix}001`;
    }

    const lastNumber = parseInt(lastProduct.productCode.replace(prefix, ''));
    const nextNumber = lastNumber + 1;
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
};

const dbInitializationController = {
    initializeDatabase: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            // Crear categorías
            for (const category of initialData.categories) {
                const { subcategories, ...categoryData } = category;
                await Category.upsert({
                    id: categoryData.id,
                    name: categoryData.name,
                    description: categoryData.description,
                    parentId: categoryData.parentId || null,
                    slug: categoryData.name.toLowerCase().replace(/\s+/g, '-')
                }, { transaction });

                if (subcategories) {
                    for (const subCategory of subcategories) {
                        await Category.upsert({
                            id: subCategory.id,
                            name: subCategory.name,
                            description: subCategory.description,
                            parentId: category.id,
                            slug: subCategory.name.toLowerCase().replace(/\s+/g, '-')
                        }, { transaction });
                    }
                }
            }

            // Crear tags
            for (const tag of initialData.tags) {
                await Tag.upsert({
                    id: tag.id,
                    name: tag.name,
                    type: tag.type,
                    slug: tag.name.toLowerCase().replace(/\s+/g, '-')
                }, { transaction });
            }

            // Crear opciones de producto
            for (const option of initialData.productOptions) {
                await ProductOption.upsert({
                    id: option.id,
                    name: option.name,
                    type: option.type,
                    value: option.value
                }, { transaction });
            }

            // Crear productos y sus variantes
            for (const productData of initialData.products) {
                // Obtener la categoría para el prefijo
                const category = await Category.findByPk(productData.categoryId, { transaction });
                const prefix = category.name.substring(0, 3).toUpperCase();
                const productCode = await generateProductCode(prefix, transaction);

                const product = await Product.upsert({
                    id: productData.id,
                    productCode, // Agregamos el productCode
                    name: productData.name,
                    description: productData.description,
                    brand: productData.brand,
                    categoryId: productData.categoryId,
                    status: productData.status
                }, { transaction });

                // Asociar tags
                if (productData.tags) {
                    await product[0].setTags(productData.tags, { transaction });
                }

                // Crear variantes
                for (const variantData of productData.variants) {
                    // Generar SKU
                    const sku = `${productCode}-${variantData.options.join('-')}`;

                    const variant = await ProductVariant.create({
                        sku,
                        productId: product[0].id,
                        price: variantData.price,
                        stock: variantData.stock,
                        image_url: variantData.image_url,
                        status: variantData.status,
                        discountPrice: variantData.discountPrice,
                        discountStart: variantData.discountStart,
                        discountEnd: variantData.discountEnd
                    }, { transaction });

                    await variant.setProductOptions(variantData.options, { transaction });
                }
            }

            await transaction.commit();
            res.json({ 
                success: true, 
                message: 'Base de datos inicializada correctamente' 
            });

        } catch (error) {
            await transaction.rollback();
            console.error('Error en la inicialización:', error);
            res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
};

module.exports = dbInitializationController;