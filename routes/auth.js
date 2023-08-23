const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const router = express.Router();

const { User } = require('../models');

// Ruta de registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
        });

        // nodemailer para enviar un correo de registro
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'giovanyangel16@gamil.com',
                pass: 'mi_contraseña',
            },
        });

        const mailOptions = {
            from: 'giovanyangel16@gmail.com',
            to: email,
            subject: 'Registro Exitoso',
            text: 'Gracias por registrarte a la app de mundo Disney, tu registro fue exitoso',
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error al enviar el correo', error);
            } else {
                console.log('Correo enviado: ', info.response);
            }
        });

        res.status(201).json({ message: 'Registro exitoso' });
    } catch (error) {
        console.error('Error al registrar el usuario: ', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta de inicio de sesión y token JWT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;