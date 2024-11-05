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

// psql -U postgres
// TODO Pendientes:
// Order id no se ve completo en admin ni en user. 
// Admin en user campos q no exiten ubicacion compras?? 
// Form crear user viejo admin, actualizar sin address y campos nuevos. 
// Admin panel configuracion no hace nada. 


// Revisar codigo front, sacar cosas no utilizadas, reestructurar todo.
// Revisar y entender todo el codigo. Luego avanzar con nuevas funcionalidades.
// Ocultar admin para users.


// NUEVAS FUNCIONALIDADES.
// Sesion de invitado, q puede hacer? Puede comprar? Forzar a login?
// Mi perfil, mis orders, ver factura
// Panel de admin facturas.
// Panel de admin botones para enviar email pre-definidos y actualizar estados de pedidos. (empacado, enviado, recibido, error, etc.)
// Historial de ventas/compras en user
// Analitics con info real.
// Implemetar maps en info contacto y para enviar pedidos.
// Anotaciones por admin en orders. 
// Emails auto y manuales.
// Permanecer conectado. No cerrar sesion con reload.
// Login google.
// Validar todo los forms, errores abajo
// Separar front y back. 2 package.json
// Revisar mercado pago, nike, etc para sacar + funcionalidades.


// After:
// Remaster, productos, detailproduct con talles mas fotos zoom. Array de talles? Quedan 3 M, 2 L, etc... Colores, distintas img. Prod relacionados. Etc
// Remaster, filtros, escalable / editable. Para x prod, x filtros (zapatillas talle, camisetas talle)