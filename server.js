"use strict";
// IMPORTS
    // Express
    const express = require('express');
    const app = express();
    //Dotenv
    require('dotenv').config();
    //Models
    const Usuario = require('./routes/usuario');
    const Grupo = require('./routes/grupo');
    const Evento = require('./routes/evento');

    
// CONFIG
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); 

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
