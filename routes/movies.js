const express = require('express');
const router = express.Router();
const { Movie, Character, Genre } = require('../models');
const authMiddleware = require('../middlewares/auth');

// Middleware para verificar autenticación para todas las rutas
router.use(authMiddleware);

// Obtener listado de películas
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.findAll({
            attributes: ['id', 'imagen', 'titulo', 'fecha_creacion'],
        });
        res.json(movies);
    } catch (error) {
        console.error('Error al obtener películas:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener detalle de una película por ID
router.get('/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await Movie.findByPk(movieId, {
            include: [
                {
                    model: Character,
                    attributes: ['id', 'nombre', 'imagen'],
                    through: { attributes: [] },
                },
                {
                    model: Genre,
                    attributes: ['id', 'nombre', 'imagen'],
                    through: { attributes: [] },
                },
            ],
        });

        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        res.json(movie);
    } catch (error) {
        console.error('Error al obtener detalle de película:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Agregar nueva película
router.post('/', async (req, res) => {
    try {
        const { imagen, titulo, fecha_creacion, calificacion } = req.body;

        const movie = await Movie.create({
            imagen,
            titulo,
            fecha_creacion,
            calificacion,
        });

        res.status(201).json(movie);
    } catch (error) {
        console.error('Error al crear película:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Editar película por ID
router.put('/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const { imagen, titulo, fecha_creacion, calificacion } = req.body;

        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        await movie.update({
            imagen,
            titulo,
            fecha_creacion,
            calificacion,
        });

        res.status(200).json(movie);
    } catch (error) {
        console.error('Error al editar película:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Eliminar película por ID
router.delete('/:id', async (req, res) => {
    const movieId = req.params.id;

    try {
        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        await movie.destroy();

        res.status(204).json({ message: 'Película eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar película:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Agregar personajes a una película
router.post('/:id/characters/:characterId', async (req, res) => {
    const movieId = req.params.id;
    const characterId = req.params.characterId;

    try {
        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        const character = await Character.findByPk(characterId);

        if (!character) {
            return res.status(404).json({ error: 'Personaje no encontrado' });
        }

        await movie.addCharacter(character);

        res.status(200).json({ message: 'Personaje agregado exitosamente a la película' });
    } catch (error) {
        console.error('Error al agregar personaje a película:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Agregar géneros a una película
router.post('/:id/genres/:genreId', async (req, res) => {
    const movieId = req.params.id;
    const genreId = req.params.genreId;

    try {
        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        const genre = await Genre.findByPk(genreId);

        if (!genre) {
            return res.status(404).json({ error: 'Género no encontrado' });
        }

        await movie.addGenre(genre);

        res.status(200).json({ message: 'Género agregado exitosamente a la película' });
    } catch (error) {
        console.error('Error al agregar género a película:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;