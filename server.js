"use strict";
// IMPORTS
// Express
const express = require('express');
const app = express();
//Dotenv
require('dotenv').config();
// Cors
const cors = require('cors')


//Models
const Usuario = require('./routes/usuario');
const Grupo = require('./routes/grupo');
const Evento = require('./routes/evento');
const Post = require('./routes/post');



// CONFIG
// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(cors())


// Usuario
app.use('/usuario', Usuario);

// Grupo
app.use('/grupo', Grupo);

// Evento
app.use('/evento', Evento)

// Post
app.use('/post', Post)


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Server Ok!")
});
