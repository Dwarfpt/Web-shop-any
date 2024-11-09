// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Импорт компонентов Header и Footer
import Header from './components/Header';
import Footer from './components/Footer';

// Импорт страниц
import Products from './pages/Products';
import Home from './pages/Home';
import Register from './pages/Register';  
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import RegisterAdmin from './pages/RegisterAdmin'; // Импорт нового компонента
import Blog from './pages/Blog';
import Catalog from './pages/Catalog';
import News from './pages/News';
import ContactUs from './pages/ContactUs';

// Импорт контекста аутентификации
import { AuthContext } from './components/AuthContext';

// Компонент для защищённых маршрутов
const PrivateRoute = ({ children }) => {
  const { auth } = React.useContext(AuthContext);
  return auth.token ? children : <Navigate to="/login" />;
};

// Компонент для маршрутов, доступных только администраторам
const AdminRoute = ({ children }) => {
  const { auth } = React.useContext(AuthContext);
  return auth.token && auth.user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Router>
      <Header /> {/* Включение Header */}
      <div style={{ minHeight: '80vh' }}> {/* Контейнер для основного контента */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
          <Route 
            path="/register-admin" 
            element={
              <AdminRoute>
                <RegisterAdmin />
              </AdminRoute>
            } 
          />
          <Route path="*" element={
            <div className="container mt-5 text-center">
              <h1>404 Not Found</h1>
              <p>Страница не найдена</p>
            </div>
          } />
        </Routes>
      </div>
      <Footer /> {/* Включение Footer */}
    </Router>
  );
}

export default App;
