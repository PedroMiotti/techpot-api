"use strict";
// IMPORTS
    // Express
    const express = require('express');
    const app = express();
    //Dotenv
    require('dotenv').config();
    //Models
    const Usuario = require('./models/usuario');
    const Grupo = require('./models/grupo');
    const Evento = require('./models/evento');

    
// CONFIG
    app.use(express.json());

    // Usuario
    app.use('/usuario', Usuario);
    
    // Grupo
    app.use('/grupo', Grupo);

    // Evento
    app.use('/evento', Evento)


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("Server Ok!")
});
