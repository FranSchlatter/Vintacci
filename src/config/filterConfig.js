// src/config/filterConfig.js
export const filterConfig = {
    // Filtros basados en el producto base
    category: {
        title: "Categorías",
        type: "select",
        getOptions: (categories) => categories.map(cat => ({
            value: cat.id,
            label: cat.name
        }))
    },
    brand: {
        title: "Marcas",
        type: "checkbox",
        getOptions: (products) => [...new Set(products.map(p => p.brand))]
    },
    status: {
        title: "Estado",
        type: "checkbox",
        options: ["active", "inactive", "draft"]
    },
    price: {
        title: "Precio",
        type: "range",
        getRange: (products) => {
            const allPrices = products.flatMap(p => 
                p.ProductVariants.map(v => Number(v.price))
            );
            return {
                min: Math.min(...allPrices),
                max: Math.max(...allPrices)
            };
        }
    },
    options: {
        title: "Opciones",
        type: "nested",
        sections: {
            color: {
                title: "Colores",
                type: "checkbox",
                getOptions: (options) => 
                    options
                        .filter(opt => opt.type === 'color')
                        .map(opt => ({
                            value: opt.id,
                            label: opt.name
                        }))
            },
            size: {
                title: "Talles",
                type: "checkbox",
                getOptions: (options) => 
                    options
                        .filter(opt => opt.type === 'size')
                        .map(opt => ({
                            value: opt.id,
                            label: opt.name
                        }))
            }
        }
    },
    tags: {
        title: "Etiquetas",
        type: "checkbox",
        getOptions: (products) => {
            const allTags = products.flatMap(p => p.Tags || []);
            return [...new Set(allTags.map(tag => ({
                value: tag.id,
                label: tag.name,
                type: tag.type
            })))];
        }
    }
};