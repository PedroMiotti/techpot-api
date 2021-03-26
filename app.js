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
const Usuario = require('./routes/api/usuario');
const Grupo = require('./routes/api/grupo');
const Evento = require('./routes/api/evento');
const Post = require('./routes/api/post');

// CONFIG
// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(cors())


// Usuario
app.use('/api/v1/user', Usuario);
// Grupo
app.use('/api/v1/groups', Grupo);
// Evento
app.use('/api/v1/events', Evento)
// Post
app.use('/api/v1/posts', Post)


module.exports = app;
