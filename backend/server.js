const express = require('express');
const winston = require('winston');
const cors = require('cors');

const app = express();

// ✅ Use CORS before routes
app.use(cors({ origin: 'http://localhost:3001' }));

// ✅ Winston logger with timestamp
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'backend/login_attempts.log', level: 'info' })
    ]
});

app.use(express.json()); // For parsing application/json

// Simulating login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    logger.info(`Login attempt with username: ${username}`);

    if (username === 'admin' && password === 'password') {
        logger.info('Login successful');
        res.status(200).json({ message: 'Login successful!' });
    } else {
        logger.warn('Login failed');
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
