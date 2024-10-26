// src/config/filterConfig.js
export const filterConfig = {
    sex: {
        title: 'Género',
        options: ['Hombre', 'Mujer', 'Unisex', 'Niño']
    },
    size: {
        title: 'Talla',
        options: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    category: {
        title: 'Categoría',
        options: ['Camisetas', 'Pantalones', 'Zapatillas', 'Buzo', 'Campera']
    },
    brand: {
        title: 'Marca',
        options: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour']
    },
    style: {
        title: 'Estilo',
        options: ['Casual', 'Deportivo', 'Formal', 'Vintage', 'Urbano']
    },
    era: {
        title: 'Época',
        options: ['Verano', 'Inverno']
    },
    color: {
        title: 'Color',
        options: ['Negro', 'Blanco', 'Gris', 'Azul', 'Verde', 'Amarillo']
    },
    material: {
        title: 'Material',
        options: ['Algodón', 'Tela', 'Cuero', 'Mezclilla', 'Nylon']
    }
};

// era: { // Posible mejora futura.
//     title: 'Época',
//     options: ['60s', '70s', '80s', '90s', '2000s']
// },