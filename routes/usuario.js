"use strict";

// IMPORTS
    // Express
    const express = require('express');
    const router = express.Router();
    //JWT
    const jwt = require('jsonwebtoken');

    //MODEL
    const Usuario = require('../models/usuario')


// MIDDLEWARE
    // --> Check if the user is logged in or not
    const authToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        
        if(authHeader == null) return res.status(401).send({message: "Não autorizado"}) 
        
        jwt.verify(authHeader, process.env.JWT_SECRET, (err) => {
            if(err) return res.status(401).send({message: "Não autorizado"});

            next();
        })
        
    }


// ROTAS

    // --> Efetuar login
    router.post("/login" , async (req, res) => {
        let u = req.body;
        console.log(req.body)
        await Usuario.login(u.email, u.senha, res)

    });


    // --> Criar Usuario
    router.post("/criar", async (req, res) => {
        let u = req.body;
        
        await Usuario.createUser(u, res);

    });

    // --> Confirmar E-mail
    router.post("/confirm-email/:token"), async (req, res) => {



    }




module.exports = router;