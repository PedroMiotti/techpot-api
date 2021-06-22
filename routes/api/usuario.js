"use strict";

// IMPORTS
// Express
const express = require('express');
const router = express.Router();

//MODEL
const Usuario = require('../../models/usuario');


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
router.post("/", async (req, res) => {
    let u = req.body;
    
    await Usuario.createUser(u, res);

});

// --> Info Usuario
router.get("/:id", async (req, res) => {
    let { id } = req.params;

    let resp = await Usuario.infoUser(id);

    res.status(parseInt(resp.status)).send(resp.send);
})

// --> Editar usuario
router.put("/:id", async (req, res) => {
    let { id } = req.params;
    let u = req.body;
    await Usuario.updateUser(id, u, res);

})

// --> Deletar Usuario
router.delete('/:id', async (res, req) => {});

// --> Confirmar E-mail
router.post("/confirm-email/:token", async (req, res) => { });







module.exports = router;
