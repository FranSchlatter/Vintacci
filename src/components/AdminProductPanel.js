import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../redux/actions/productActions';

const AdminProductPanel = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.allProducts);

    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        style: '',
        era: '',
        size: '',
        sex: '',
        color: '',
        material: '',
        image_url: '',
        stock: '',
        serial_number: ''
    });

    // Actualiza el estado para que se vea lo que voy escribiendo en el form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Get products al cargar
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Post product
    const handleAddProduct = () => {
        dispatch(addProduct(newProduct));
        setNewProduct({ name: '', description: '', price: '', category: '', brand: '', style: '', era: '', size: '', sex: '', color: '', material: '', image_url: '', stock: '', serial_number: '' });
    };

    // Cargar los datos que del product en el formulario
    const handleEditProduct = (product) => {
        setEditProduct(product);
        setNewProduct({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            brand: product.brand,
            style: product.style,
            era: product.era,
            size: product.size,
            sex: product.sex,
            color: product.color,
            material: product.material,
            image_url: product.image_url,
            stock: product.stock,
            serial_number: product.serial_number
        });
    };

    // Update product
    const handleUpdateProduct = async () => {
        if (!editProduct) return;
        dispatch(updateProduct(editProduct.id, newProduct));
        setEditProduct(null);
        setNewProduct({ name: '', description: '', price: '', category: '', brand: '', style: '', era: '', size: '', sex: '', color: '', material: '', image_url: '', stock: '', serial_number: '' });
    };

    // Delete product
    const handleDeleteProduct = async (id) => {
        dispatch(deleteProduct(id));
    };

    return (
        <div className="admin-product-panel p-5 bg-gray-800 text-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Panel de Administración de Productos</h2>
            <div className="add-product-form mb-4">
                <h3 className="text-lg font-semibold mb-2">Agregar Producto</h3>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre del producto"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Descripción"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Precio"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Categoría"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="brand"
                    placeholder="Marca"
                    value={newProduct.brand}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="style"
                    placeholder="Estilo"
                    value={newProduct.style}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="era"
                    placeholder="Época"
                    value={newProduct.era}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="size"
                    placeholder="Talle"
                    value={newProduct.size}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="sex"
                    placeholder="Sexo"
                    value={newProduct.sex}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="color"
                    placeholder="Color"
                    value={newProduct.color}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="material"
                    placeholder="Material"
                    value={newProduct.material}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="image_url"
                    placeholder="URL de la imagen"
                    value={newProduct.image_url}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="serial_number"
                    placeholder="Número de serie"
                    value={newProduct.serial_number} 
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <button onClick={editProduct ? handleUpdateProduct : handleAddProduct} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    {editProduct ? 'Actualizar Producto' : 'Agregar Producto'}
                </button>
            </div>

            <div className="product-list">
                <h3 className="text-lg font-semibold mb-2">Lista de Productos</h3>
                {products && products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between mb-2 p-2 border-b">
                        <div>
                            <img className="w-36 h-auto" src={product.image_url} alt={product.name} />
                        </div>
                        <div>
                            <p>Nombre: {product.name}</p>
                            <p>Descripción: {product.description}</p>
                            <p>Precio: {product.price}</p>
                            <p>Talle: {product.size}</p>
                        </div>
                        <div>
                            <p>Categoria: {product.category}</p>
                            <p>Marca: {product.brand}</p>
                            <p>Estlo: {product.style}</p>
                            <p>Epoca: {product.era}</p>
                            <p>Sexo: {product.sex}</p>
                        </div>
                        <div>
                            <p>Stock: {product.stock}</p>
                            <p>Color: {product.color}</p>
                            <p>Material: {product.material}</p>
                            <p>Número de serie: {product.serial_number}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEditProduct(product)} className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2">Editar</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProductPanel;