// src/controllers/productController.js
const { Product, Category, Tag, ProductVariant, ProductOption } = require('../models');
const { Op } = require('sequelize');

// Función auxiliar para generar el siguiente código de producto
const generateProductCode = async (prefix = 'PROD') => {
    const lastProduct = await Product.findOne({
        where: {
            productCode: {
                [Op.like]: `${prefix}%`
            }
        },
        order: [['productCode', 'DESC']]
    });

    if (!lastProduct) {
        return `${prefix}001`;
    }

    const lastNumber = parseInt(lastProduct.productCode.replace(prefix, ''));
    const nextNumber = lastNumber + 1;
    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
};

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
            const products = await Product.findAll({
                include: [
                    {
                        model: Category,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Tag,
                        through: { attributes: [] },
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
            res.json(products);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error al obtener productos');
        }
    },

    createProduct: async (req, res) => {
        const { 
            name, 
            description, 
            brand,
            categoryId,
            tags,
            variants,
            status = 'active'
        } = req.body;

        if (!name || !description || !categoryId || !variants || variants.length === 0) {
            return res.status(400).send('Faltan campos obligatorios');
        }

        try {
            // Validar combinaciones únicas de opciones
            await validateUniqueOptionCombination(variants);

            // Generar código de producto
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).send('Categoría no encontrada');
            }
            
            const prefix = category.name.substring(0, 3).toUpperCase();
            const productCode = await generateProductCode(prefix);

            // Crear el producto base
            const newProduct = await Product.create({
                productCode,
                name,
                description,
                brand,
                categoryId,
                status
            });

            // Asociar tags si existen
            if (tags && tags.length > 0) {
                await newProduct.setTags(tags);
            }

            // Crear variantes
            for (const variant of variants) {
                try {
                    // Obtener las opciones completas para generar el SKU
                    const optionsData = await ProductOption.findAll({
                        where: {
                            id: variant.options
                        }
                    });

                    if (optionsData.length !== variant.options.length) {
                        throw new Error('Algunas opciones especificadas no existen');
                    }

                    const sku = await generateSKU(productCode, optionsData);

                    const newVariant = await ProductVariant.create({
                        sku,
                        price: variant.price,
                        stock: variant.stock,
                        image_url: variant.image_url,
                        status: variant.status || 'active',
                        discountPrice: variant.discountPrice,
                        discountStart: variant.discountStart,
                        discountEnd: variant.discountEnd,
                        productId: newProduct.id
                    });

                    await newVariant.setProductOptions(variant.options);
                } catch (variantError) {
                    // Si hay un error creando una variante, eliminamos el producto y todas las variantes creadas
                    await newProduct.destroy();
                    throw new Error(`Error creando variante: ${variantError.message}`);
                }
            }

            // Obtener el producto completo con sus relaciones
            const completeProduct = await Product.findByPk(newProduct.id, {
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
            brand,
            categoryId,
            tags,
            variants,
            status 
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
                brand,
                categoryId,
                status
            });

            // Actualizar tags
            if (tags) {
                await product.setTags(tags);
            }

            // Actualizar variantes
            if (variants) {
                // Eliminar variantes existentes que no están en la nueva lista
                const existingVariants = await ProductVariant.findAll({
                    where: { productId: id }
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
                                image_url: variant.image_url,
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
                            image_url: variant.image_url,
                            status: variant.status || 'active',
                            discountPrice: variant.discountPrice,
                            discountStart: variant.discountStart,
                            discountEnd: variant.discountEnd,
                            productId: id
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
        const { productId } = req.params;
        const variantData = req.body;
    
        try {
            // Verificar que el producto existe
            const product = await Product.findByPk(productId);
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
                where: { productId },
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
                image_url: variantData.image_url,
                status: variantData.status || 'active',
                discountPrice: variantData.discountPrice,
                discountStart: variantData.discountStart,
                discountEnd: variantData.discountEnd,
                productId
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
        const { productId, variantId } = req.params;
        const updateData = req.body;
    
        try {
            // Verificar que el producto existe
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
    
            // Verificar que la variante existe y pertenece al producto
            const variant = await ProductVariant.findOne({
                where: { 
                    id: variantId,
                    productId: productId
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
        const { productId, variantId } = req.params;
    
        try {
            // Verificar que el producto existe
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
    
            // Verificar que la variante existe y pertenece al producto
            const variant = await ProductVariant.findOne({
                where: { 
                    id: variantId,
                    productId: productId
                }
            });
    
            if (!variant) {
                return res.status(404).send('Variante no encontrada');
            }
    
            // Asegurarse de que no es la última variante
            const variantCount = await ProductVariant.count({
                where: { productId: productId }
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