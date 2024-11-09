// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const auth = require('../middleware/authMiddleware'); // Middleware для проверки аутентификации
const admin = require('../middleware/admin'); // Middleware для проверки роли администратора

// @route   POST /api/auth/register
// @desc    Регистрация пользователя (автоматически роль 'user')
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Валидация
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля.' });
    }

    try {
        // Проверка существования пользователя
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
        }

        // Хэширование пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание нового пользователя с ролью 'user'
        user = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });

        await user.save();

        // Создание JWT токена
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Серверная ошибка.');
    }
});

// @route   POST /api/auth/login
// @desc    Вход пользователя
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля.' });
    }

    try {
        // Проверка существования пользователя
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Неверный email или пароль.' });
        }

        // Сравнение паролей
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный email или пароль.' });
        }

        // Создание JWT токена
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Серверная ошибка.');
    }
});

// @route   GET /api/auth/me
// @desc    Получить данные текущего пользователя
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Серверная ошибка.' });
    }
});

// @route   POST /api/auth/register-admin
// @desc    Регистрация администратора (только для администраторов)
// @access  Private/Admin
router.post('/register-admin', auth, admin, async (req, res) => {
    const { username, email, password } = req.body;

    // Валидация
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля.' });
    }

    try {
        // Проверка существования пользователя
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует.' });
        }

        // Хэширование пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание нового администратора
        user = new User({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        await user.save();

        // Создание JWT токена
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Серверная ошибка.');
    }
});

// @route   GET /api/auth/me
// @desc    Получить данные текущего пользователя
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Серверная ошибка.' });
    }
});

module.exports = router;
