"use strict";

// IMPORTS
    // Express
    const express = require('express');
    const router = express.Router();


class Grupo {
    constructor(id, nome, descricao, criador_id, foto, cor_banner, data_criacao ){
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.criador_id = criador_id;
        this.foto = foto;
        this.cor_banner = cor_banner;
        this.data_criacao = data_criacao;
    }

    



}



module.exports = Grupo;
