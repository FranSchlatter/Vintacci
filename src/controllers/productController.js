// src/controllers/productController.js
// TODO
const { Product, Category, Tag, ProductVariant, ProductOption } = require('../models');
const { Op } = require('sequelize');

// Función auxiliar para generar el siguiente código de producto
// const generateProductCode = async (prefix = 'PROD') => {
//     const lastProduct = await Product.findOne({
//         where: {
//             productCode: {
//                 [Op.like]: `${prefix}%`
//             }
//         },
//         order: [['productCode', 'DESC']]
//     });

//     if (!lastProduct) {
//         return `${prefix}001`;
//     }

//     const lastNumber = parseInt(lastProduct.productCode.replace(prefix, ''));
//     const nextNumber = lastNumber + 1;
//     return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
// };

// Función auxiliar para generar SKU
const generateSKU = async (productCode, options) => {
    const optionValues = options
        .sort((a, b) => a.type.localeCompare(b.type))
        .map(option => {
            // Usamos el nombre completo, sin espacios y en mayúsculas
            return option.name.toUpperCase().replace(/\s+/g, '');
        });
    const baseSKU = `${productCode}-${optionValues.join('-')}`;

    // Verificar si el SKU ya existe
    const existingSKU = await ProductVariant.findOne({
        where: { sku: baseSKU }
    });

    if (existingSKU) {
        throw new Error(`Ya existe una variante con el SKU ${baseSKU}`);
    }

    return baseSKU;
};

// Función auxiliar para validar combinación única de opciones
const validateUniqueOptionCombination = (variants) => {
    const combinations = new Set();
    for (const variant of variants) {
        if (!variant.options || variant.options.length === 0) {
            throw new Error('Cada variante debe tener opciones especificadas');
        }
        
        const optionKey = variant.options.sort().join('-');
        if (combinations.has(optionKey)) {
            throw new Error('No puede haber variantes con la misma combinación de opciones');
        }
        combinations.add(optionKey);
    }
    return true;
};

const productController = {
    getAllProducts: async (req, res) => {
        try {
            // ⚙️ 1. Recibir params para paginado, filtros, búsqueda, orden
            let page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const offset = (page - 1) * limit;
    
            const { categoryIds, name, sortBy } = req.query;
            
            // Intentamos parsear tagIds si viene como string JSON
            let tagIds = [];
            if (req.query.tagIds) {
                try {
                    const decodedTagIds = decodeURIComponent(req.query.tagIds);
                    tagIds = JSON.parse(decodedTagIds);
                } catch (e) {
                    tagIds = req.query.tagIds || [];
                }
            }

            const categoryArray = categoryIds
            const where = {};

            if (name) {
                where.name = { [Op.iLike]: `%${name}%` };
            }

            const orderOptions = {
                'price-low': [['price', 'ASC']],
                'price-high': [['price', 'DESC']],
                'newest': [['createdAt', 'DESC']],
            };

            const order = orderOptions[sortBy] || [['createdAt', 'DESC']];
            
            // Si hay filtros de tags, aplicamos una estrategia diferente
            let productIds = null;

            // Si hay filtros de tags, primero obtenemos los IDs de producto que cumplen
            if (tagIds && tagIds.length > 0) {
                // Agrupar tags por tipo
                const tagsByType = tagIds.reduce((acc, tag) => {
                    if (!acc[tag.type]) acc[tag.type] = [];
                    acc[tag.type].push(tag.id);
                    return acc;
                }, {});
                
                // Para cada tipo de tag, buscar productos con al menos un tag de ese tipo
                const typeQueries = await Promise.all(Object.entries(tagsByType).map(async ([type, ids]) => {
                    const result = await Product.findAll({
                        attributes: ['id'],
                        include: [{
                            model: Tag,
                            as: 'AssociatedToTag',
                            attributes: [],
                            through: { attributes: [] },
                            where: {
                                type: type,
                                id: { [Op.in]: ids }
                            }
                        }],
                        raw: true
                    });
                    return result.map(p => p.id);
                }));
                
                // Intersección de todos los arrays de IDs (productos que tienen al menos un tag de cada tipo)
                productIds = typeQueries.reduce((acc, ids) => 
                    acc.filter(id => ids.includes(id)), 
                    typeQueries[0] || []);
                
                if (productIds.length === 0) {
                    return res.json({
                        totalItems: 0,
                        totalPages: 0,
                        currentPage: 1,
                        products: []
                    });
                }
                
                // Agregar filtro por IDs a la consulta principal
                where.id = { [Op.in]: productIds };
            }

            // ACTUALIZA LA CONSULTA PRINCIPAL ASÍ
            const { count, rows } = await Product.findAndCountAll({
                where,
                include: [
                    {
                        model: Category,
                        as: 'AssociatedToCat',
                        through: { attributes: [] },
                        attributes: ['id', 'name'],
                        ...(categoryArray && { where: { id: { [Op.in]: categoryArray } } })
                    },
                    {
                        model: Tag,
                        as: 'AssociatedToTag',
                        through: { attributes: [] },
                        attributes: ['id', 'name', 'type']
                    },
                    {
                        model: ProductVariant,
                        attributes: ['id', 'sku', 'price'],
                        include: [{
                            model: ProductOption,
                            through: { attributes: [] },
                        }]
                    }
                ],
                limit,
                offset,
                distinct: true,
                order
            });

            // ⚙️ 11. Devolver resultados paginados
            res.json({
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                products: rows
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener productos');
        }
    },

    createProduct: async (req, res) => {
        const { 
            name, 
            description, 
            price,
            image_url,
            status = 'active',
            categoryIds,
            tagIds,
            variants
        } = req.body;

        if (!name || !description || !price || !categoryIds || !tagIds || !variants || variants.length === 0) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        try {
            // Obtener todas las opciones y clasificarlas por tipo
            const allOptions = await ProductOption.findAll({
                where: {
                    id: variants[0].options
                },
                attributes: ['id', 'name', 'type', 'price']
            });

            // Agrupar opciones por tipo
            const optionsByType = allOptions.reduce((acc, option) => {
                if (!acc[option.type]) {
                    acc[option.type] = [];
                }
                acc[option.type].push(option);
                return acc;
            }, {});

            // Validar que tenemos al menos una opción de cada tipo requerido
            const requiredTypes = ['size', 'badge', 'customize'];
            for (const type of requiredTypes) {
                if (!optionsByType[type] || optionsByType[type].length === 0) {
                    throw new Error(`Falta al menos una opción del tipo: ${type}`);
                }
            }

            // Generar todas las combinaciones posibles
            const combinations = [];
            for (const size of optionsByType.size) {
                for (const badge of optionsByType.badge) {
                    for (const customize of optionsByType.customize) {
                        combinations.push([size.id, badge.id, customize.id]);
                    }
                }
            }

            // Generar código de producto (mantenemos el TODO por ahora)
            const productCode = 'Test12'; // TODO

            // Crear el producto base
            const newProduct = await Product.create({
                productCode,
                name,
                description,
                price,
                image_url,
                status
            });

            // Asociar categories
            if (categoryIds && categoryIds.length > 0) {
                await newProduct.setAssociatedToCat(categoryIds);
            }

            // Asociar tagIds
            if (tagIds && tagIds.length > 0) {
                await newProduct.setAssociatedToTag(tagIds);
            }

            // Crear variantes para cada combinación
            for (const combination of combinations) {
                try {
                    const optionsData = allOptions.filter(opt => combination.includes(opt.id));
                    
                    // Calcular precio de la variante
                    const variantPrice = optionsData.reduce((sum, option) => sum + Number(option.price), 0);
                    
                    // Generar SKU
                    const sku = await generateSKU(productCode, optionsData);

                    // Crear la variante
                    const newVariant = await ProductVariant.create({
                        sku,
                        price: price + variantPrice,
                        stock: 0,
                        status: 'active',
                        discountPrice: null,
                        discountStart: null,
                        discountEnd: null,
                        product_id: newProduct.id
                    });

                    await newVariant.setProductOptions(combination);
                } catch (variantError) {
                    await newProduct.destroy();
                    throw new Error(`Error creando variante: ${variantError.message}`);
                }
            }

            // Obtener el producto completo con sus relaciones
            const completeProduct = await Product.findByPk(newProduct.id, {
                include: [
                    {
                        model: Category,
                        as: 'AssociatedToCat',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Tag,
                        through: { attributes: [] },
                        as: 'AssociatedToTag',
                        attributes: ['id', 'name', 'type']
                    },
                    {
                        model: ProductVariant,
                        include: [{
                            model: ProductOption,
                            through: { attributes: [] }
                        }]
                    }
                ]
            });

            res.status(201).json(completeProduct);
        } catch (err) {
            console.error('Error al agregar el producto:', err.message);
            res.status(500).send(err.message);
        }
    },

    updateProduct: async (req, res) => {
        const { id } = req.params;
        const { 
            name,
            description,
            price,
            image_url,
            status,
            categoryIds,
            tagIds,
            variants
        } = req.body;

        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }

            if (variants) {
                await validateUniqueOptionCombination(variants);
            }

            // Actualizar producto base
            await product.update({
                name,
                description,
                price,
                image_url,
                categoryIds,
                status
            });

            // Actualizar tagIds
            if (tagIds) {
                await product.setAssociatedToTag(tagIds);
            }

            // Actualizar variantes
            if (variants) {
                // Eliminar variantes existentes que no están en la nueva lista
                const existingVariants = await ProductVariant.findAll({
                    where: { product_id: id }
                });

                const existingVariantIds = existingVariants.map(v => v.id);
                const newVariantIds = variants.filter(v => v.id).map(v => v.id);
                const variantsToDelete = existingVariantIds.filter(id => !newVariantIds.includes(id));

                await ProductVariant.destroy({
                    where: { id: variantsToDelete }
                });

                // Actualizar o crear nuevas variantes
                for (const variant of variants) {
                    if (variant.id) {
                        const existingVariant = await ProductVariant.findByPk(variant.id);
                        if (existingVariant) {
                            await existingVariant.update({
                                price: variant.price,
                                stock: variant.stock,
                                status: variant.status || existingVariant.status,
                                discountPrice: variant.discountPrice,
                                discountStart: variant.discountStart,
                                discountEnd: variant.discountEnd
                            });
                            if (variant.options) {
                                await existingVariant.setProductOptions(variant.options);
                            }
                        }
                    } else {
                        // Obtener las opciones completas para generar el SKU
                        const optionsData = await ProductOption.findAll({
                            where: {
                                id: variant.options
                            }
                        });

                        if (optionsData.length !== variant.options.length) {
                            throw new Error('Algunas opciones especificadas no existen');
                        }

                        const sku = await generateSKU(product.productCode, optionsData);

                        const newVariant = await ProductVariant.create({
                            sku,
                            price: variant.price,
                            stock: variant.stock,
                            status: variant.status || 'active',
                            discountPrice: variant.discountPrice,
                            discountStart: variant.discountStart,
                            discountEnd: variant.discountEnd,
                            product_id: id
                        });
                        
                        await newVariant.setProductOptions(variant.options);
                    }
                }
            }

            // Obtener producto actualizado con todas sus relaciones
            const updatedProduct = await Product.findByPk(id, {
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Tag,
                        through: { attributes: [] }
                    },
                    {
                        model: ProductVariant,
                        include: [{
                            model: ProductOption,
                            through: { attributes: [] }
                        }]
                    }
                ]
            });

            res.json(updatedProduct);
        } catch (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    },

    deleteProduct: async (req, res) => {
        const { id } = req.params;

        try {
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }

            // Las variantes se eliminarán automáticamente por la relación CASCADE
            await product.destroy();
            res.status(204).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar el producto');
        }
    },

    getProductById: async (req, res) => {
        const { id } = req.params;
        try {
            const product = await Product.findByPk(id, {
                include: [
                    {
                        model: Category,
                        through: { attributes: [] },
                        as: 'AssociatedToCat',
                        // attributes: ['id', 'name']
                    },
                    {
                        model: Tag,
                        through: { attributes: [] },
                        as: 'AssociatedToTag',
                        // attributes: ['id', 'name', 'type']
                    },
                    {
                        model: ProductVariant,
                        // attributes: ['id', 'sku', 'price'],
                        include: [{
                            model: ProductOption,
                            through: { attributes: [] },
                        }]
                    }
                ]
            });
            
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
            res.json(product);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener el producto');
        }
    },

    createVariant: async (req, res) => {
        const { product_id } = req.params;
        const variantData = req.body;
    
        try {
            // Verificar que el producto existe
            const product = await Product.findByPk(product_id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
    
            // Obtener las opciones completas para generar el SKU
            const optionsData = await ProductOption.findAll({
                where: {
                    id: variantData.options
                }
            });
    
            if (optionsData.length !== variantData.options.length) {
                throw new Error('Algunas opciones especificadas no existen');
            }
    
            // Validar que no exista la misma combinación de opciones
            const existingVariants = await ProductVariant.findAll({
                where: { product_id },
                include: [{
                    model: ProductOption,
                    through: { attributes: [] }
                }]
            });
    
            const newCombination = variantData.options.sort().join('-');
            const hasDuplicate = existingVariants.some(variant => {
                const combination = variant.ProductOptions.map(opt => opt.id).sort().join('-');
                return combination === newCombination;
            });
    
            if (hasDuplicate) {
                return res.status(400).send('Ya existe una variante con esta combinación de opciones');
            }
    
            // Generar SKU
            const sku = await generateSKU(product.productCode, optionsData);
    
            // Crear la nueva variante
            const newVariant = await ProductVariant.create({
                sku,
                price: variantData.price,
                stock: variantData.stock,
                status: variantData.status || 'active',
                discountPrice: variantData.discountPrice,
                discountStart: variantData.discountStart,
                discountEnd: variantData.discountEnd,
                product_id
            });
    
            // Asociar las opciones
            await newVariant.setProductOptions(variantData.options);
    
            // Obtener la variante creada con sus relaciones
            const createdVariant = await ProductVariant.findByPk(newVariant.id, {
                include: [{
                    model: ProductOption,
                    through: { attributes: [] }
                }]
            });
    
            res.status(201).json(createdVariant);
        } catch (err) {
            console.error('Error al crear la variante:', err.message);
            res.status(500).send(err.message);
        }
    },

    updateVariant: async (req, res) => {
        const { product_id, variantId } = req.params;
        const updateData = req.body;
    
        try {
            // Verificar que el producto existe
            const product = await Product.findByPk(product_id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
    
            // Verificar que la variante existe y pertenece al producto
            const variant = await ProductVariant.findOne({
                where: { 
                    id: variantId,
                    product_id: product_id
                }
            });
    
            if (!variant) {
                return res.status(404).send('Variante no encontrada');
            }
    
            // Actualizar solo los campos proporcionados
            await variant.update(updateData);
    
            // Obtener la variante actualizada con sus relaciones
            const updatedVariant = await ProductVariant.findByPk(variantId, {
                include: [{
                    model: ProductOption,
                    through: { attributes: [] }
                }]
            });
    
            res.json(updatedVariant);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al actualizar la variante');
        }
    },
    deleteVariant: async (req, res) => {
        const { product_id, variantId } = req.params;
    
        try {
            // Verificar que el producto existe
            const product = await Product.findByPk(product_id);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
    
            // Verificar que la variante existe y pertenece al producto
            const variant = await ProductVariant.findOne({
                where: { 
                    id: variantId,
                    product_id: product_id
                }
            });
    
            if (!variant) {
                return res.status(404).send('Variante no encontrada');
            }
    
            // Asegurarse de que no es la última variante
            const variantCount = await ProductVariant.count({
                where: { product_id: product_id }
            });
    
            if (variantCount <= 1) {
                return res.status(400).send('No se puede eliminar la última variante del producto');
            }
    
            await variant.destroy();
            res.status(204).send();
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al eliminar la variante');
        }
    }
};

module.exports = productController;