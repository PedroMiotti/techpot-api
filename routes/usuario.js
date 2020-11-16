"use strict";

// IMPORTS
    // Express
    const express = require('express');
    const router = express.Router();

    //MODEL
    const Usuario = require('../models/usuario')


// ROTAS

    // --> Efetuar login
    router.post("/login" , async (req, res) => {
        let u = req.body;

        await Usuario.login(u.email, u.senha, res)

    });


    // --> Criar Usuario
    router.post("/criar", async (req, res) => {
        let u = req.body;
        console.log(u)
        await Usuario.createUser(u, res);

    });

    // --> Info Usuario
    router.post("/info", async( req, res) => {
        let id = req.body.id;

        await Usuario.infoUser(id, res);
    })

    // --> Confirmar E-mail
    router.post("/confirm-email/:token"), async (req, res) => {}

    




module.exports = router;