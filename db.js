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
// Crear versionado sin user-login, sin carrito, only catalogo con mensaje a wsp con la info cargada. Cambiar logo, colores, nombre. Crear apartado FAQ, about us, etc. 
// Revisar todo, cargar all products y subir a prod


// Fixs:
// prod img se traspapelan con las de las badges
// precio de prodOption abajo chiquito
// filtros no andan
// Testear tutti di presto


// After:
// Panel de admin/user facturas. Que hace, descargar?
// Historial de compras x user > panel admin
// Implemetar maps en info contacto.

// Paycheck real, o mercado pago fake.
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