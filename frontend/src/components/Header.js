// frontend/src/components/Header.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Header = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Ваш Сайт</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/blog">Блог</Nav.Link>
                        <Nav.Link as={Link} to="/catalog">Каталог</Nav.Link>
                        <Nav.Link as={Link} to="/news">Новости</Nav.Link>
                        <Nav.Link as={Link} to="/contact-us">Контакты</Nav.Link>
                    </Nav>
                    <Nav>
                        {!auth.token ? (
                            <>
                                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                                <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/dashboard">Личный кабинет</Nav.Link>
                                {auth.user && auth.user.role === 'admin' && (
                                    <Nav.Link as={Link} to="/admin">Админ-панель</Nav.Link>
                                )}
                                <Button variant="outline-light" onClick={handleLogout}>Выйти</Button>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
