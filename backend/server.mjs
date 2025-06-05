import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Clave secreta para firmar el token.
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(bodyParser.json());

// Ejemplo de una base de datos simulada de usuarios con dos usuarios para pruebas
const users = [
    {
        id: 1,
        email: 'user@example.com',
        password: '$2a$10$m7LMUOv26EGcWsEhgZwIY.z57qQAvFFOlsv8HM8iRP3i0hIy3qr5u' // Contraseña: "password123"
    },
    {
        id: 2,
        email: 'test@example.com',
        password: '$2a$10$g1fsrzW/ztrt2abF9oKTguwMyYJfwR4rmth0mFSVOOEdhbE.a9YuS' // Contraseña: "testpassword"
    }
];

// Ruta para manejar el inicio de sesión
app.post('/api/login', async (req, res) => {
    console.log('Solicitud de login recibida:', req.body);
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) {
        console.log('Usuario no encontrado:', email);
        return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        console.log('Contraseña incorrecta para el usuario:', email);
        return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    console.log('Inicio de sesión exitoso para el usuario:', email);
    res.json({ success: true, token, user: { id: user.id, email: user.email } });
});

// Ruta para encriptar una nueva contraseña (puedes usar esta para crear contraseñas)
app.post('/api/encrypt', async (req, res) => {
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Nueva contraseña encriptada:', hashedPassword);
    res.json({ hashedPassword });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
