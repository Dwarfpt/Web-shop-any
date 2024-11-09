// frontend/src/pages/AdminPanel.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Tabs, Tab, Table, Button, Modal, Form, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';

const AdminPanel = () => {
    const { auth } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Для модального окна назначения роли
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('user');

    // Для модального окна создания пользователя
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });

    // Получение всех пользователей
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Не удалось получить пользователей.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Обработка назначения роли
    const handleAssignRole = async () => {
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/users/${selectedUser._id}/role`, { role: newRole }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchUsers();
            setShowRoleModal(false);
            setSelectedUser(null);
            setNewRole('user');
            setSuccess(res.data.message);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Не удалось назначить роль.');
        }
    };

    // Обработка создания нового пользователя
    const handleCreateUser = async () => {
        const { username, email, password, role } = newUser;

        // Простая валидация
        if (!username || !email || !password || !role) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/users`, newUser, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchUsers();
            setShowCreateUserModal(false);
            setNewUser({
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
            setSuccess('Пользователь успешно создан.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Не удалось создать пользователя.');
        }
    };

    // Обработка удаления пользователя
    const handleDeleteUser = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            setUsers(users.filter(user => user._id !== id));
            setSuccess('Пользователь успешно удален.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Не удалось удалить пользователя.');
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h3>Админ-панель</h3>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                            {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
                            <Tabs defaultActiveKey="users" id="admin-tabs" className="mb-3">
                                <Tab eventKey="users" title="Управление пользователями">
                                    <Button variant="success" className="mb-3" onClick={() => setShowCreateUserModal(true)}>
                                        Создать пользователя
                                    </Button>
                                    <Table striped bordered hover responsive className="mt-3">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Имя пользователя</th>
                                                <th>Email</th>
                                                <th>Роль</th>
                                                <th>Действия</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((user, index) => (
                                                <tr key={user._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>
                                                    <td>
                                                        <Button variant="warning" size="sm" className="me-2" onClick={() => { setSelectedUser(user); setShowRoleModal(true); }}>
                                                            Назначить роль
                                                        </Button>
                                                        <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user._id)}>
                                                            Удалить
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Tab>
                                <Tab eventKey="products" title="Управление товарами">
                                    {/* Добавлен компонент для управления товарами */}
                                    <AddProduct />
                                </Tab>
                                {/* Можно добавить другие вкладки при необходимости */}
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Модальное окно для назначения роли */}
            <Modal show={showRoleModal} onHide={() => setShowRoleModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Назначить роль</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Form>
                            <Form.Group className="mb-3" controlId="formUserName">
                                <Form.Label>Имя пользователя</Form.Label>
                                <Form.Control type="text" value={selectedUser.username} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formUserEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={selectedUser.email} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formUserRole">
                                <Form.Label>Новая роль</Form.Label>
                                <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                                    <option value="user">Пользователь</option>
                                    <option value="admin">Администратор</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRoleModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleAssignRole}>
                        Назначить
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно для создания пользователя */}
            <Modal show={showCreateUserModal} onHide={() => setShowCreateUserModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Создать пользователя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formCreateUsername">
                            <Form.Label>Имя пользователя</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите имя"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCreateEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Введите email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCreatePassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите пароль"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formCreateRole">
                            <Form.Label>Роль</Form.Label>
                            <Form.Select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="user">Пользователь</option>
                                <option value="admin">Администратор</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateUserModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleCreateUser}>
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )};

// Добавленный компонент для управления товарами
const AddProduct = () => {
    const { auth } = useContext(AuthContext);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAddProduct = async () => {
        const { name, description, price, imageUrl } = newProduct;

        if (!name || !description || !price) {
            setError('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/products`, newProduct, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            });
            setSuccess('Товар успешно добавлен.');
            setShowAddProductModal(false);
            setNewProduct({
                name: '',
                description: '',
                price: '',
                imageUrl: ''
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Не удалось добавить товар.');
        }
    };

    return (
        <>
            <Button variant="primary" className="mb-3" onClick={() => setShowAddProductModal(true)}>
                Добавить товар
            </Button>
            <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить товар</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                    {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
                    <Form>
                        <Form.Group className="mb-3" controlId="formProductName">
                            <Form.Label>Название товара</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите название"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductDescription">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Введите описание"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductPrice">
                            <Form.Label>Цена (₽)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Введите цену"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                required
                                min="0"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProductImage">
                            <Form.Label>URL изображения</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите URL изображения"
                                value={newProduct.imageUrl}
                                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddProductModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleAddProduct}>
                        Добавить
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AdminPanel;
