// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Адрес вашего фронтенда
    credentials: true
}));
app.use(express.json());

// Маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products')); // Маршруты для продуктов
app.use('/api/users', require('./routes/users')); // Маршруты для пользователей
//app.use('/api/contact', require('./routes/contact')); // Маршруты для контактов

// Корневой маршрут
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Проверка подключения к MongoDB и запуск сервера
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB подключен');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });
})
.catch(err => {
    console.error('Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
});
