const express = require('express');
const router = express.Router();
const { Genre, Movie } = require('../models');
const authMiddleware = require('../middlewares/auth');

// Middleware para verificar autenticación en todas las rutas
router.use(authMiddleware);

// Obtener listado de géneros
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.findAll({
            attributes: ['id', 'nombre', 'imagen'],
        });
        res.json(genres);
    } catch (error) {
        console.error('Error al obtener géneros:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener detalle de un género por ID
router.get('/:id', async (req, res) => {
    const genreId = req.params.id;

    try {
        const genre = await Genre.findByPk(genreId, {
            include: {
                model: Movie,
                attributes: ['id', 'imagen', 'titulo'],
                through: { attributes: [] }, // Evitar mostrar datos de la tabla de unión
            },
        });

        if (!genre) {
            return res.status(404).json({ error: 'Género no encontrado' });
        }

        res.json(genre);
    } catch (error) {
        console.error('Error al obtener detalle de género:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Agregar nueva película a un género
router.post('/:id/movies/:movieId', async (req, res) => {
    const genreId = req.params.id;
    const movieId = req.params.movieId;

    try {
        const genre = await Genre.findByPk(genreId);

        if (!genre) {
            return res.status(404).json({ error: 'Género no encontrado' });
        }

        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        await genre.addMovie(movie);

        res.status(200).json({ message: 'Película agregada exitosamente al género' });
    } catch (error) {
        console.error('Error al agregar película a género:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;