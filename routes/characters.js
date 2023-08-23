const express = require('express');
const router = express.Router();
const { Character, Movie } = require('../models');
const authMiddleware = require('../middlewares/auth'); 

// Middleware para verificar la autenticación en todas las rutas
router.use(authMiddleware);

// Obtener listado de personajes
router.get('/', async (req, res) => {
    try {
        const characters = await Character.findAll({
            attributes: ['id', 'imagen', 'nombre'],
        });
        res.json(characters);
    } catch (error) {
        console.error('Error al obtener personajes:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener detalle de un personaje por ID
router.get('/:id', async (req, res) => {
    const characterId = req.params.id;

    try {
        const character = await Character.findByPk(characterId, {
            include: {
                model: Movie,
                attributes: ['id', 'imagen', 'titulo'],
                through: { attributes: [] }, 
            },
        });

        if (!character) {
            return res.status(404).json({ error: 'Personaje no encontrado' });
        }

        res.json(character);
    } catch (error) {
        console.error('Error al obtener detalle de personaje:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Agregar nuevo personaje
router.post('/', async (req, res) => {
    try {
        const { imagen, nombre, edad, peso, historia } = req.body;

        const character = await Character.create({
            imagen,
            nombre,
            edad,
            peso,
            historia,
        });

        res.status(201).json(character);
    } catch (error) {
        console.error('Error al crear personaje:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Editar personaje por ID
router.put('/:id', async (req, res) => {
    const characterId = req.params.id;

    try {
        const { imagen, nombre, edad, peso, historia } = req.body;

        const character = await Character.findByPk(characterId);

        if (!character) {
            return res.status(404).json({ error: 'Personaje no encontrado' });
        }

        await character.update({
            imagen,
            nombre,
            edad,
            peso,
            historia,
        });

        res.status(200).json(character);
    } catch (error) {
        console.error('Error al editar personaje:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar personaje por ID
router.delete('/:id', async (req, res) => {
    const characterId = req.params.id;

    try {
        const character = await Character.findByPk(characterId);

        if (!character) {
            return res.status(404).json({ error: 'Personaje no encontrado' });
        }

        await character.destroy();

        res.status(204).json({ message: 'Personaje eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar personaje:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;