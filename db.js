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

module.exports = sequelize; // Exporta el objeto sequelize



// El flujo de datos desde la base de datos hasta el frontend en tu aplicación React con Redux y Express sigue varios pasos. Aquí te dejo un resumen detallado del proceso:

// 1. Base de Datos (DB)
// PostgreSQL: Es donde se almacenan los datos (en tu caso, productos y usuarios). La base de datos tiene tablas que contienen registros de productos y usuarios.

// 2. Servidor Backend (Express)
// Express: Este es el servidor que se encarga de manejar las solicitudes HTTP del cliente (frontend).
// Rutas: Se definen rutas específicas para interactuar con la base de datos.
// Por ejemplo, la ruta GET /products se utiliza para obtener todos los productos de la base de datos.
// Controladores: Dentro de las rutas, hay lógica para manejar las solicitudes:
// Cuando se recibe una solicitud GET /products, el servidor realiza una consulta a la base de datos utilizando pool.query() para obtener todos los productos.
// Una vez que recibe los datos, el servidor envía una respuesta JSON al cliente.

// 3. Acciones de Redux
// Acción de Obtener Productos: En tu aplicación, hay una acción de Redux (fetchProducts) que se encarga de hacer la solicitud al servidor.
// Utiliza axios para realizar una solicitud GET a http://localhost:5000/products.
// Cuando la solicitud es exitosa, se despacha una acción de éxito con el tipo FETCH_PRODUCTS_SUCCESS, enviando los datos recibidos como payload.
// Si hay un error, se despacha una acción de fallo con el tipo FETCH_PRODUCTS_FAILURE.

// 4. Reducer de Redux
// Reducer: Cuando se despacha una acción, Redux pasa esa acción al reducer correspondiente (productReducer).
// Dependiendo del tipo de acción:
// FETCH_PRODUCTS_SUCCESS: Actualiza el estado de Redux con los productos obtenidos de la base de datos.
// FETCH_PRODUCTS_FAILURE: Actualiza el estado para reflejar el error.

// 5. Estado Global de Redux
// Almacén (Store): El estado global se almacena en el "store" de Redux. En tu caso, el estado tiene una propiedad products que contiene los productos obtenidos.
// El componente ProductsPage usa useSelector para acceder a state.products.products, que es donde se almacenan los productos.

// 6. Componente Frontend (React)
// ProductsPage: Este componente utiliza el hook useEffect para despachar la acción fetchProducts() al cargar la página.
// Al recibir los productos, se pasan como props al componente ProductList, que se encarga de renderizar cada producto utilizando el componente ProductItem.

// 7. Renderizado en la Interfaz de Usuario
// ProductList y ProductItem: ProductList itera sobre el array de productos y renderiza un ProductItem para cada uno.
// Cada ProductItem muestra la información del producto (nombre, descripción, precio e imagen).

// Resumen del Flujo de Datos
// DB: La base de datos contiene los productos.
// Servidor Express: Cuando se solicita GET /products, el servidor obtiene los datos de la base de datos y responde con un JSON.
// Redux Action: fetchProducts realiza la solicitud al servidor.
// Reducer: El reducer actualiza el estado de Redux con los productos.
// Frontend: ProductsPage obtiene los productos del estado y los renderiza.
// Este flujo garantiza que los datos fluyan de manera eficiente desde la base de datos hasta el frontend, permitiendo una aplicación dinámica y reactiva. Si tienes alguna pregunta adicional o quieres profundizar en algún paso específico, ¡házmelo saber!

// psql -U postgres
// TODO Pendientes:
// Favs no anda, posible falta de datos de user en el componente.
// Agregar direccion user faltan datos.
// Compra direccion de envio elegir de las cargadas. O cargar y guardar.
// Orders no se vinculan con user. No se ven en el lugar del user, ni el user se ve en la orden de admin.
// Create user de admin, cambiar logica para q no sea identico al de register.
// Revisar codigo, sacar cosas no utilizadas, reestructurar todo.
// Revisar y entender todo el codigo. Luego avanzar con nuevas funcionalidades.
// Ocultar admin para users.


// NUEVAS FUNCIONALIDADES.
// Sesion de invitado, q puede hacer? Puede comprar? Forzar a login?
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