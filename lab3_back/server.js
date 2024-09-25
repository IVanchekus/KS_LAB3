const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Настройка CORS
app.use(cors());

// Настройка body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка подключения к PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

// Получение всех понятий
app.get('/api/concepts', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM concepts');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Получение определения понятия по имени
app.get('/api/concepts/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM concepts WHERE name = $1', [name]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Concept not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Добавление нового понятия
app.post('/api/concepts', async (req, res) => {
    const { name, definition } = req.body;
    try {
        const { rows } = await pool.query('INSERT INTO concepts (name, definition) VALUES ($1, $2) RETURNING *', [name, definition]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Удаление понятия по имени
app.delete('/api/concepts/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM concepts WHERE name = $1 RETURNING *', [name]);
        if (rows.length > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Concept not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});