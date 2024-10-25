import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser } from '../redux/actions/userActions';

const AdminUserPanel = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.allUsers);

    const [editUser, setEditUser] = useState(null);
    const [newUser, setNewUser] = useState({
        username: '',
        gmail: '',
        password: '',
        role: '',
        first_name: '',
        last_name: '',
        dni: '',
        country: '',
        city: '',
        postal_code: '',
        street: '',
        height: '',
        apartment: '',
    });

    // Actualiza el estado para que se vea lo que voy escribiendo en el form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Get users al cargar
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Post user
    const handleAddUser = () => {
        dispatch(addUser(newUser));
        setNewUser({ username: '', gmail: '', password: '', role: '', first_name: '', last_name: '', dni: '', country: '', city: '', postal_code: '', street: '', height: '', apartment: '' }); // Clear form
    };

    // Cargar los datos que ya tenia el user en el formulario
    const handleEditUser = (user) => {
        setEditUser(user);
        setNewUser({ 
            username: user.username, 
            gmail: user.gmail, 
            password: user.password,
            role: user.role, 
            first_name: user.first_name, 
            last_name: user.last_name, 
            dni: user.dni, 
            country: user.country, 
            city: user.city, 
            postal_code: user.postal_code, 
            street: user.street, 
            height: user.height,
            apartment: user.apartment
        });
    };
 
    // Update user
    const handleUpdateUser = async () => {
        if (!editUser) return;
        dispatch(updateUser(editUser.id, newUser));
        setEditUser(null);
        setNewUser({ role: '', first_name: '', last_name: '', dni: '', country: '', city: '', postal_code: '', street: '', height: '', apartment: '', username: '', gmail: '', password: '' });
    };

    // Delete user
    const handleDeleteUser = async (id) => {
        dispatch(deleteUser(id));
    };

    return (
        <div className="admin-user-panel p-5 bg-gray-800 text-white rounded-lg shadow-md mb-4 mt-5">
            <h2 className="text-xl font-bold mb-4">Panel de Administración de Usuarios</h2>
            <div className="add-user-form mb-4">
                <h3 className="text-lg font-semibold mb-2">Agregar Usuario</h3>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="email"
                    name="gmail"
                    placeholder="Gmail"
                    value={newUser.gmail}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="password"
                    placeholder="Contraseña"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="role"
                    placeholder="Rol"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="first_name"
                    placeholder="Nombre"
                    value={newUser.first_name}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Apellido"
                    value={newUser.last_name}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    value={newUser.dni}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="country"
                    placeholder="País"
                    value={newUser.country}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="city"
                    placeholder="Ciudad"
                    value={newUser.city}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="postal_code"
                    placeholder="Código Postal"
                    value={newUser.postal_code}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="street"
                    placeholder="Calle"
                    value={newUser.street}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="height"
                    placeholder="Altura"
                    value={newUser.height}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <input
                    type="text"
                    name="apartment"
                    placeholder="Departamento (opcional)"
                    value={newUser.apartment}
                    onChange={handleInputChange}
                    className="border p-2 mr-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mt-1"
                />
                <button onClick={editUser ? handleUpdateUser : handleAddUser} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    {editUser ? 'Actualizar Usuario' : 'Agregar Usuario'}
                </button>
            </div>

            {/* TODO Acomodar para que se vea mejor */} 
            <div className="user-list">
                <h3 className="text-lg font-semibold mb-2">Lista de Usuarios</h3>
                {users && users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between mb-2 p-2 border-b">
                        <div>
                            <p>Username: {user.username}</p>
                            <p>Gmail: {user.gmail}</p>
                            <p>Contraseña: {user.password}</p>
                            <p>Rol: {user.role}</p>
                        </div>
                        <div>
                            <p>Nombre: {user.first_name} {user.last_name}</p>
                            <p>DNI: {user.dni}</p>
                            <p>País: {user.country}</p>
                            <p>Ciudad: {user.city}</p>
                        </div>
                        <div>
                            <p>Código Postal: {user.postal_code}</p>
                            <p>Calle: {user.street}</p>
                            <p>Altura: {user.height}</p>
                            <p>Departamento: {user.apartment}</p>
                        </div>
                        <div>
                            <button onClick={() => handleEditUser(user)} className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 mr-2">
                                Editar
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white p-1 rounded hover:bg-red-600">
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUserPanel;