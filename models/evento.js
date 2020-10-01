"use strict";

// IMPORTS
    // Express
    const express = require('express');
    const router = express.Router();


class Evento {
    constructor(id, nome, descricao, data_comeco, hora_comeco, data_fim, hora_fim, foto_perfil, fotos_carrossel, categoria ){
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.data_comeco = data_comeco;
        this.hora_comeco = hora_comeco;
        this.data_fim = data_fim;
        this.hora_fim = hora_fim;
        this.foto_perfil = foto_perfil;
        this.fotos_carrossel = fotos_carrossel;
        this.categoria = categoria;
    }

    



}



module.exports = Evento;