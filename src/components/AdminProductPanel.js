// src/components/AdminProductPanel.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, deleteProduct, updateProduct } from '../redux/actions/productActions';

const AdminProductPanel = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.products);

    // Estado local para los campos del formulario
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image_url: ''
    });

    const [editMode, setEditMode] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: value });
    };

    // Agregar producto
    const handleAddProduct = () => {
        dispatch(addProduct(newProduct));
        setNewProduct({ name: '', description: '', price: '', image_url: '' }); // Limpiar el formulario
    };

    // Editar producto
    const handleEditProduct = () => {
        dispatch(updateProduct(productToEdit.id, newProduct));
        setEditMode(false);
        setNewProduct({ name: '', description: '', price: '', image_url: '' });
    };

    // Eliminar producto
    const handleDeleteProduct = (productId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            return;
        }
        dispatch(deleteProduct(productId));  // Aquí enviamos el ID al backend
    };


    return (
        <div className="admin-panel bg-gray-100 p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Gestionar Productos</h2>

            {/* Formulario para agregar/editar producto */}
            <div className="mb-4">
                <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    placeholder="Nombre del producto"
                    className="mb-2 p-2 border rounded"
                />
                <input
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    placeholder="Descripción"
                    className="mb-2 p-2 border rounded"
                />
                <input
                    type="text"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Precio"
                    className="mb-2 p-2 border rounded"
                />
                <input
                    type="text"
                    name="image_url"
                    value={newProduct.image_url}
                    onChange={handleInputChange}
                    placeholder="URL de la imagen"
                    className="mb-2 p-2 border rounded"
                />

                {editMode ? (
                    <button
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
                        onClick={handleEditProduct}
                    >
                        Guardar Cambios
                    </button>
                ) : (
                    <button
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-700"
                        onClick={handleAddProduct}
                    >
                        Agregar Producto
                    </button>
                )}
            </div>

            {/* Lista de productos con opciones de editar y eliminar */}
            <ul>
                {products.map((product) => (
                    <li key={product.id} className="border-b p-2 flex justify-between">
                        <span>{product.name} - ${product.price}</span>
                        <div>
                            <button
                                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700 mr-2"
                                onClick={() => {
                                    setEditMode(true);
                                    setProductToEdit(product);
                                    setNewProduct({
                                        name: product.name,
                                        description: product.description,
                                        price: product.price,
                                        image_url: product.image_url
                                    });
                                }}
                            >
                                Editar
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                onClick={() => handleDeleteProduct(product.id)}  // Pasar el ID del producto
                            >
                                Eliminar
                            </button>

                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminProductPanel;
