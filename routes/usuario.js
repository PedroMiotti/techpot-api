"use strict";

// IMPORTS
// Express
const express = require('express');
const router = express.Router();

//MODEL
const Usuario = require('../models/usuario');


// ROTAS

// --> Login CAS
router.get("/login-cas", async (req, res) => {
  let token = req.query.token;

  await Usuario.loginCas(token, res);

})


// --> Efetuar login
router.post("/login", async (req, res) => {
    let u = req.body;

    await Usuario.login(u.email, u.senha, res)

});


// --> Criar Usuario
router.post("/criar", async (req, res) => {
    let u = req.body;
    console.log(u);
    await Usuario.createUser(u, res);

});

// --> Info Usuario
router.get("/info/:id", async (req, res) => {
    let id = req.params.id;

    await Usuario.infoUser(id, res);
})

// --> Editar usuario
router.post("/editar", async (req, res) => {
    let u = req.body;
    let id = u.id;
    let userInfo = u.userInfo;

    await Usuario.updateUser(id, userInfo, res);

})

// --> Confirmar E-mail
router.post("/confirm-email/:token"), async (req, res) => { }







module.exports = router;
