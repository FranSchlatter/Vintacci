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

// Función auxiliar para procesar precios
const processPrice = (price) => {
    if (typeof price === 'string') {
        const cleanPrice = price.replace(/[^\d.]/g, '');
        const parts = cleanPrice.split('.');
        if (parts.length > 2) {
            return parseFloat(parts[0] + '.' + parts[1]);
        }
        return parseFloat(cleanPrice);
    }
    return parseFloat(price || 0);
};

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

// Función recursiva para procesar categorías y subcategorías
const processCategories = async (categories, parent_id = null, transaction) => {
    try {
        for (const category of categories) {
            const slug = category.name.toLowerCase().replace(/\s+/g, '-');
            
            // Usar upsert para mantener el ID original
            await Category.upsert({
                id: category.id, // Mantener el ID original
                name: category.name,
                description: category.description,
                parent_id: parent_id,
                slug: slug
            }, { transaction });

            // Procesar subcategorías si existen
            if (category.subcategories && category.subcategories.length > 0) {
                await processCategories(category.subcategories, category.id, transaction);
            }
        }
    } catch (error) {
        throw new Error(`Error procesando categorías: ${error.message}`);
    }
};

const processTag = async (tagData, transaction) => {
    try {
        const slug = tagData.name.toLowerCase().replace(/\s+/g, '-');
        
        // Usar upsert para mantener el ID original
        await Tag.upsert({
            id: tagData.id, // Mantener el ID original
            name: tagData.name,
            type: tagData.type,
            slug
        }, { transaction });

        // Obtener el tag creado
        const tag = await Tag.findByPk(tagData.id, { transaction });

        // Asociar con las categorías usando los IDs originales
        if (tagData.categoryPath && tagData.categoryPath.length > 0) {
            for (const categoryId of tagData.categoryPath) {
                await tag.addAssociatedToCat(categoryId, { transaction });
            }
        }

        return tag;
    } catch (error) {
        throw new Error(`Error procesando tag ${tagData.name}: ${error.message}`);
    }
};

const processProductOption = async (optionData, transaction) => {
    try {
        await ProductOption.upsert({
            id: optionData.id,
            name: optionData.name,
            type: optionData.type,
            price: processPrice(optionData.price) || 0,
            image_url: optionData.image_url
        }, { transaction });
    } catch (error) {
        throw new Error(`Error procesando opción de producto ${optionData.name}: ${error.message}`);
    }
};

const processProduct = async (productData, transaction) => {
    try {
        // Obtener la categoría principal para el prefijo del código
        const mainCategory = await Category.findByPk(productData.categoryIds[0], { 
            transaction 
        });
        
        if (!mainCategory) {
            throw new Error(`No se encontró la categoría principal para el producto ${productData.name}`);
        }

        // Generar el código de producto usando el prefijo de la categoría
        const prefix = mainCategory.name.substring(0, 3).toUpperCase();
        const productCode = await generateProductCode(prefix, transaction);

        // Crear el producto base
        const product = await Product.upsert({
            id: productData.id,
            productCode,
            name: productData.name,
            description: productData.description,
            price: processPrice(productData.price),
            image_url: productData.image_url,
            status: productData.status || 'active'
        }, { transaction });

        // Obtener la instancia del producto
        const productInstance = await Product.findByPk(productData.id, { transaction });

        // Asociar categorías y tags
        if (productData.categoryIds && productData.categoryIds.length > 0) {
            await productInstance.setAssociatedToCat(productData.categoryIds, { transaction });
        }

        if (productData.tagIds && productData.tagIds.length > 0) {
            await productInstance.setAssociatedToTag(productData.tagIds, { transaction });
        }

        // Obtener todas las opciones y clasificarlas por tipo
        const allOptions = await ProductOption.findAll({
            where: {
                id: productData.variants[0].options
            },
            attributes: ['id', 'name', 'type', 'price'],
            transaction
        });

        // Agrupar opciones por tipo
        const optionsByType = allOptions.reduce((acc, option) => {
            if (!acc[option.type]) {
                acc[option.type] = [];
            }
            acc[option.type].push(option);
            return acc;
        }, {});

        // Generar todas las combinaciones posibles
        const combinations = [];
        for (const size of (optionsByType.size || [])) {
            for (const badge of (optionsByType.badge || [])) {
                for (const customize of (optionsByType.customize || [])) {
                    combinations.push([size.id, badge.id, customize.id]);
                }
            }
        }

        // Crear variantes para cada combinación
        for (const combination of combinations) {
            const optionsData = allOptions.filter(opt => combination.includes(opt.id));
            
            // Calcular precio de la variante
            const variantPrice = optionsData.reduce((sum, option) => 
                sum + processPrice(option.price), 0
            );
            
            // Generar SKU usando el nuevo productCode
            const sku = `${productCode}-${combination.join('-')}`;

            // Crear la variante
            const variant = await ProductVariant.create({
                sku,
                price: processPrice(productData.price) + variantPrice,
                stock: 0,
                status: 'active',
                discountPrice: null,
                discountStart: null,
                discountEnd: null,
                product_id: productInstance.id
            }, { transaction });

            // Asociar opciones a la variante
            await variant.setProductOptions(combination, { transaction });
        }

        return product;
    } catch (error) {
        throw new Error(`Error procesando producto ${productData.name}: ${error.message}`);
    }
};

const dbInitializationController = {
    initializeDatabase: async (req, res) => {
        const transaction = await sequelize.transaction();

        try {
            // 1. Crear categorías
            await processCategories(initialData.categories, null, transaction);

            // 2. Crear tags
            for (const tag of initialData.tags) {
                await processTag(tag, transaction);
            }

            // 3. Crear opciones de producto
            for (const option of initialData.productOptions) {
                await processProductOption(option, transaction);
            }

            // 4. Crear productos y sus variantes
            for (const product of initialData.products) {
                await processProduct(product, transaction);
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