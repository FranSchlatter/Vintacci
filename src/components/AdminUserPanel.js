import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUserPanel = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [editUser, setEditUser] = useState(null);

    // Obtener usuarios al cargar el componente
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddUser = async () => {
        if (!newUser.username || !newUser.email || !newUser.password) {
            console.error('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/users', newUser);
            setUsers((prevUsers) => [...prevUsers, response.data]);
            setNewUser({ username: '', email: '', password: '' });
        } catch (error) {
            console.error('Error al agregar usuario:', error.message);
        }
    };

    const handleEditUser = (user) => {
        setEditUser(user);
        setNewUser({ username: user.username, email: user.email, password: '' }); // La contraseña no se edita
    };

    const handleUpdateUser = async () => {
        if (!editUser) return;

        try {
            const response = await axios.put(`http://localhost:5000/users/${editUser.id}`, newUser);
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === editUser.id ? response.data : user))
            );
            setEditUser(null);
            setNewUser({ username: '', email: '', password: '' });
        } catch (error) {
            console.error('Error al actualizar usuario:', error.message);
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/users/${id}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
        }
    };

    return (
        <div className="admin-user-panel p-5">
            <h2 className="text-xl font-bold mb-4">Panel de Administración de Usuarios</h2>
            <div className="add-user-form mb-4">
                <h3 className="text-lg font-semibold">Agregar Usuario</h3>
                <input
                    type="text"
                    name="username"
                    placeholder="Nombre de usuario"
                    value={newUser.username}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                />
                <input
                    type="text"
                    name="password"
                    placeholder="Contraseña"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="border p-2 mr-2"
                />
                <button onClick={editUser ? handleUpdateUser : handleAddUser} className="bg-blue-500 text-white p-2">
                    {editUser ? 'Actualizar Usuario' : 'Agregar Usuario'}
                </button>
            </div>

            <div className="user-list">
                <h3 className="text-lg font-semibold mb-2">Lista de Usuarios</h3>
                {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between mb-2 p-2 border-b">
                        <div>
                            <p>Nombre de usuario: {user.username}</p>
                            <p>Email: {user.email}</p>
                            <p>Contraseña: {user.password}</p> {/* Muestra la contraseña */}
                        </div>
                        <div>
                            <button onClick={() => handleEditUser(user)} className="bg-yellow-400 text-white p-1 mr-2">
                                Editar
                            </button>
                            <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white p-1">
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
