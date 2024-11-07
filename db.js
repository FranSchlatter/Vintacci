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
// Panel de admin/user facturas. Que hace, descargar?
// Emails > contacto, panel de admin botones para enviar email pre-definidos y actualizar estados de pedidos. (empacado, enviado, etc.), email manual, email stock newletter true
// Historial de compras x user > panel admin
// Implemetar maps en info contacto.



// After:
// Remaster, filtros, escalable / editable. Para x prod, x filtros (zapatillas talle, camisetas talle)
// Remaster, productos, detailproduct con talles mas fotos zoom. Prod relacionados. Etc
// Producto = info basica para todos igual
// - Opciones = [{color: xxx, xxx, xxx
// -             talle: xxx, xxx, xxx}] // mostras las opctions y en base a lo q seleciconas se muestra la variant
// - Variant = [{color1,talle1 ... stock.. img... precio... blablabla. ID > Esto es lo que se mete al order},
// -            {color2,talle1 ... stock.. img... precio... blablabla. ID > Esto es lo que se mete al order}] 

// Paycheck real, o mercado pago fake.
// Separar front y back. 2 package.json
// Revisar mercado pago, nike, etc para sacar + funcionalidades.
// Permanecer conectado. No cerrar sesion con reload.
// Sesion de invitado, q puede hacer? Puede comprar? Forzar a login?
// Login google.
// Analitics con info real.
// Admin panel configuracion. 