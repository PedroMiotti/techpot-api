"use strict";

// IMPORTS
    // Express
    const express = require('express');
    const router = express.Router();

    //MODEL
    const Evento = require('../models/evento');

    //listar eventos
    router.get("/listar", async (req, res) => {
        await Evento.listarEventos(res);
    });

    //Deletar evento
    router.delete("/:id", async (req, res) => {
        await Evento.deletarEvento(req.params.id, res);
    })

    //Criar Evento - ** como pegar params por body...**
    router.post("/criar", async (req, res) =>{
        let e = req.body;

        
        await Evento.criarEvento(e, res)
    });




module.exports = router;