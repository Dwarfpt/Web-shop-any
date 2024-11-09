// frontend/src/pages/Register.js
import React, { useState, useContext } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ошибка при регистрации.');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '500px' }}>
      <h2>Регистрация</h2>
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formRegisterUsername">
          <Form.Label>Имя пользователя</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите имя пользователя"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formRegisterEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Введите email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formRegisterPassword">
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            type="password"
            placeholder="Введите пароль"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </Form.Group>

        {/* Ползунок для выбора роли (Только для администраторов) */}
        {/* Рекомендуется скрыть этот элемент от публичной регистрации */}
        {/* Если требуется, добавьте его в отдельный компонент, доступный только администраторам */}

        <Button variant="primary" type="submit">
          Зарегистрироваться
        </Button>
      </Form>
    </Container>
  );
};

export default Register;
