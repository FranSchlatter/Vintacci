// db.js
const { Sequelize } = require('sequelize');

// Conexión a la base de datos usando Sequelize
const sequelize = new Sequelize('vintacci', 'postgres', 'Schlatter', {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false, // No muestra logs
});

// Verifica la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa.');
    })
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });

module.exports = sequelize;

// psql -U postgres > Emailer: FAN5743FNP4AXV6S7GYVQ73N
// TODO Pendientes:
// Panel de admin/user facturas. Que hace, descargar?
// Historial de compras x user > panel admin
// Implemetar maps en info contacto.


// After:
// Remaster, productos, detailproduct con talles mas fotos zoom. Prod relacionados. Etc
// Array imgs en variants.





// Paycheck real, o mercado pago fake.
// Separar front y back. 2 package.json
// Revisar mercado pago, nike, etc para sacar + funcionalidades.
// Permanecer conectado. No cerrar sesion con reload.
// Sesion de invitado, q puede hacer? Puede comprar? Forzar a login?
// Login google.
// Analitics con info real.
// Admin panel configuracion.



// FASE 2 - Optimización y Extensiones

// Relaciones entre productos:
// Productos complementarios
// Productos similares
// Sistema de recomendaciones básico


// Inventario y Precios:
// Sistema de alertas de stock
// Análisis básico de tendencias



// FASE 3 - Gestión Avanzada

// Stock Multi-nivel:
// Estructura de almacenes/ubicaciones
// Sistema de asignación de stock
// Lógica de selección de ubicación


// Gestión de Disponibilidad:
// Estados de producto
// Sistema de pre-orders
// Stock reservado



// FASE 4 - Personalización y Features Premium

// Customización de productos
// Opciones especiales
// Features premium específicas



// Errores: Edit product > Create variant > No re-renderiza el modals y no se muestra la variant en la lista.

