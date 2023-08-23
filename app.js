require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/characters');
const movieRoutes = require('./routes/movies');
const genreRoutes = require('./routes/genres');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Disney API',
            version: '1.0.0',
            description: 'API para explorar el mundo de Disney',
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routes

app.use('/auth', authRoutes);
app.use('/characters', characterRoutes);
app.use('/movies', movieRoutes);
app.use('/genres', genreRoutes);

app.listen(PORT, () => {
    console.log('El servidor esta corriendo en el puerto ${PORT}');
});