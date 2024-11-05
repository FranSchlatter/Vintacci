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
// Admin panel configuracion no hace nada. 


// NUEVAS FUNCIONALIDADES.
// Sesion de invitado, q puede hacer? Puede comprar? Forzar a login?
// Ocultar admin para users.
// Mi perfil, mis orders, ver/descargar factura
// Panel de admin facturas. Que hace?
// Panel de admin botones para enviar email pre-definidos y actualizar estados de pedidos. (empacado, enviado, recibido, error, etc.)
// Historial de ventas/compras en user / prod?
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
// Producto = info basica para todos igual
// - Opciones = [{color: xxx, xxx, xxx
// -             talle: xxx, xxx, xxx}] // mostras las opctions y en base a lo q seleciconas se muestra la variant
// - Variant = [{color1,talle1 ... stock.. img... precio... blablabla. ID > Esto es lo que se mete al order},
// -            {color2,talle1 ... stock.. img... precio... blablabla. ID > Esto es lo que se mete al order}] 