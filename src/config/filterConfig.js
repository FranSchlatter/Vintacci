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
        options: ['Camisetas', 'Pantalones', 'Zapatillas', 'Buzos', 'Camperas']
    },
    brand: {
        title: 'Marca',
        options: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'Columbia', 'Vans', 'Lacoste', 'The North Face']
    },
    style: {
        title: 'Estilo',
        options: ['Casual', 'Deportivo', 'Vintage', 'Urbano']
    },
    era: {
        title: 'Época',
        options: ['Verano', 'Invierno']
    },
    color: {
        title: 'Color',
        options: ['Negro', 'Blanco', 'Gris', 'Azul', 'Verde', 'Amarillo']
    },
    material: {
        title: 'Material',
        options: ['Algodón', 'Tela', 'Cuero', 'Nylon']
    }
};

// era: { // Posible mejora futura.
//     title: 'Época',
//     options: ['60s', '70s', '80s', '90s', '2000s']
// },