// models/index.js
const sequelize = require('../../db');

// Importar todos los modelos
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Invoice = require('./Invoice');
const Product = require('./Product');
const User = require('./User');
const Address = require('./Address');
const Asociacion_Users_Products = require('./Asociacion_Users_Products');
const CartItem = require('./CartItem');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductOption = require('./ProductOption');
const ProductVariant = require('./ProductVariant');
const Asociacion_Products_Tags = require('./Asociacion_Products_Tags');
const Asociacion_Variants_Options = require('./Asociacion_Variants_Options');
const Asociacion_Products_Categories = require('./Asociacion_Products_Categories');
const Asociacion_Tags_Categories = require('./Asociacion_Tags_Categories');

function initializeAssociations() {
    // Asociaciones (1:1)

    // Order - Invoice
    Order.hasOne(Invoice, {
        foreignKey: 'order_id',
        as: 'invoice',
        onDelete: 'CASCADE'
    });
    Invoice.belongsTo(Order, {
        foreignKey: 'order_id'
    });
    


    // Asociaciones (1:N)

    // User - Addresses
    User.hasMany(Address, {
        foreignKey: 'user_id',
        as: 'address',
        onDelete: 'CASCADE'
    });
    Address.belongsTo(User, {
        foreignKey: 'user_id'
    });
    // User - Orders
    User.hasMany(Order, {
        foreignKey: 'user_id',
        as: 'order',
        onDelete: 'SET NULL'
    });
    Order.belongsTo(User, {
        foreignKey: 'user_id'
    });
    // User - Cart
    User.hasMany(CartItem, {
        foreignKey: 'user_id',
        as: 'cart_item',
        onDelete: 'CASCADE'
    });
    CartItem.belongsTo(User, {
        foreignKey: 'user_id'
    });

    // Product - ProductVariant
    Product.hasMany(ProductVariant, {
        foreignKey: 'product_id',
        onDelete: 'CASCADE'
    });
    ProductVariant.belongsTo(Product, {
        foreignKey: 'product_id'
    });
    // Product - Cart
    Product.hasMany(CartItem, {
        foreignKey: 'product_id',
        onDelete: 'CASCADE'
    });
    CartItem.belongsTo(Product, {
        foreignKey: 'product_id'
    });
    // Product - OrderItem
    Product.hasMany(OrderItem, {
        foreignKey: 'product_id',
        onDelete: 'RESTRICT'
    });
    OrderItem.belongsTo(Product, {
        foreignKey: 'product_id'
    });

    // Order - OrderItems
    Order.hasMany(OrderItem, {
        foreignKey: 'order_id',
        as: 'item',
        onDelete: 'CASCADE'
    });
    OrderItem.belongsTo(Order, {
        foreignKey: 'order_id'
    });

    // Categories (auto-referencial)
    Category.hasMany(Category, { 
        foreignKey: 'parent_id',
        as: 'subcategories', 
        onDelete: 'CASCADE'
    });
    Category.belongsTo(Category, { 
        foreignKey: 'parent_id'
    });


    
    // Asociaciones (N:N)

    // User - Products > Asociacion_Users_Products
    User.belongsToMany(Product, {
        through: Asociacion_Users_Products,
        as: 'AssociatedToProd', // User.getAssociatedToProd() > Este user tiene favorito el producto: id1, id2
        foreignKey: 'user_id',
        otherKey: 'product_id',
        onDelete: 'CASCADE'
    });
    Product.belongsToMany(User, {
        through: Asociacion_Users_Products,
        as: 'AssociatedToUser', // Product.getAssociatedToUser() > Este producto es favorito de user: id1, id2
        foreignKey: 'product_id',
        otherKey: 'user_id',
        onDelete: 'CASCADE'
    });

    // Product - Category > Asociacion_Products_Categories
    Product.belongsToMany(Category, { 
        through: Asociacion_Products_Categories,
        as: 'AssociatedToCat', // Product.getAssociatedToCat() > Este producto tiene estas categoria: id1, id2
        foreignKey: 'product_id',
        otherKey: 'category_id',
        onDelete: 'CASCADE'
    });
    Category.belongsToMany(Product, { 
        through: Asociacion_Products_Categories,
        as: 'AssociatedToProd', // Category.getAssociatedToProd() > Esta categoria tiene estos producto: id1, id2
        foreignKey: 'category_id',
        otherKey: 'product_id',
        onDelete: 'CASCADE'
    });

    // Tag - Category > Asociacion_Tags_Categories
    Tag.belongsToMany(Category, { 
        through: Asociacion_Tags_Categories,
        as: 'AssociatedToCat', // Tag.getAssociatedToCat() > Este tag existe en la categoria: id1, id2
        foreignKey: 'tag_id',
        otherKey: 'category_id',
        onDelete: 'CASCADE'
    });
    Category.belongsToMany(Tag, { 
        through: Asociacion_Tags_Categories,
        as: 'AssociatedToTag', // Category.getAssociatedToTag() > Esta categoria contiene al tag: id1, id2
        foreignKey: 'category_id',
        otherKey: 'tag_id',
        onDelete: 'CASCADE'
    });

    // Products - Tags > Asociacion_Products_Tags
    Product.belongsToMany(Tag, { 
        through: Asociacion_Products_Tags,
        as: 'AssociatedToTag', // Category.getAssociatedToTag() > Esta producto contiene al tag: id1, id2
        foreignKey: 'product_id',
        otherKey: 'tag_id',
        onDelete: 'CASCADE'
    });
    Tag.belongsToMany(Product, { 
        through: Asociacion_Products_Tags,
        as: 'AssociatedToProd', // Category.getAssociatedToProd() > Este tag existe en el producto: id1, id2
        foreignKey: 'tag_id',
        otherKey: 'product_id',
        onDelete: 'CASCADE'
    });

    // Variants - Options > Asociacion_Variants_Options
    ProductVariant.belongsToMany(ProductOption, { 
        through: Asociacion_Variants_Options,
        onDelete: 'CASCADE'
    });
    ProductOption.belongsToMany(ProductVariant, { 
        through: Asociacion_Variants_Options,
        onDelete: 'CASCADE'
    });
}

// Inicializar asociaciones
initializeAssociations();

// Exportar todo
module.exports = {
    sequelize,
    User,
    Product,
    Order,
    OrderItem,
    Invoice,
    Address,
    Asociacion_Users_Products,
    CartItem,
    Category,
    Tag,
    ProductOption,
    ProductVariant,
    Asociacion_Products_Tags,
    Asociacion_Variants_Options
};