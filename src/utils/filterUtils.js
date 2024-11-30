// src/utils/filterUtils.js
export const filterProducts = (products, filters) => {
    return products.filter(product => {
        if (filters.category && product.categoryId !== filters.category) {
            return false;
        }

        if (filters.brand && !filters.brand.includes(product.brand)) {
            return false;
        }

        if (filters.status && product.status !== filters.status) {
            return false;
        }

        if (filters.tags?.length > 0) {
            const productTagIds = product.Tags.map(t => t.id);
            if (!filters.tags.some(tagId => productTagIds.includes(tagId))) {
                return false;
            }
        }

        if (filters.options) {
            const hasMatchingVariant = product.ProductVariants.some(variant => {
                const variantOptionIds = variant.ProductOptions.map(opt => opt.id);
                return Object.values(filters.options).every(optionIds => 
                    optionIds.length === 0 || optionIds.some(id => variantOptionIds.includes(id))
                );
            });
            if (!hasMatchingVariant) {
                return false;
            }
        }

        if (filters.price) {
            const hasVariantInPriceRange = product.ProductVariants.some(variant => 
                Number(variant.price) >= filters.price.min && 
                Number(variant.price) <= filters.price.max
            );
            if (!hasVariantInPriceRange) {
                return false;
            }
        }

        return true;
    });
};

export const sortProducts = (products, sortBy) => {
    switch (sortBy) {
        case 'price-asc':
            return [...products].sort((a, b) => 
                Math.min(...a.ProductVariants.map(v => v.price)) - 
                Math.min(...b.ProductVariants.map(v => v.price))
            );
        case 'price-desc':
            return [...products].sort((a, b) => 
                Math.max(...b.ProductVariants.map(v => v.price)) - 
                Math.max(...a.ProductVariants.map(v => v.price))
            );
        case 'name-asc':
            return [...products].sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return [...products].sort((a, b) => b.name.localeCompare(a.name));
        default:
            return products;
    }
};