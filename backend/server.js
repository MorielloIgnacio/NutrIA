const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Esta línea solo debe estar una vez
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Clave secreta para firmar el token. ¡Asegúrate de que esta clave esté protegida!
const JWT_SECRET = 'your_jwt_secret_key';

app.use(bodyParser.json());

// Middleware para autenticar el token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado: no se proporcionó un token' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }

        req.user = user;
        next();
    });
};

// Ejemplo de una base de datos simulada de usuarios
const users = [
    {
        id: 1,
        email: 'user@example.com',
        password: '$2a$10$7eGZmFbsnOuqOwX.nAIKv.tU4xbgvTg/aUUtV7dy/hPl.U9TEU.jC' // "password123" encriptado
    }
];

// Ruta para manejar el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    // Buscar el usuario en la base de datos simulada
    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Enviar el token al cliente
    res.json({ success: true, token, user: { id: user.id, email: user.email } });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
