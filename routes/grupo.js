'use strict';

// Requerimentos
const express = require('express');
const router = express.Router();
const Grupo = require('../models/grupo.js');


{/* ROTAS */}
// Listar grupos do usuário
router.get('/listar/:id', async(req ,res) => {
    let id = req.params.id;

    await Grupo.listarGrupos(id, res);

});

// Criar grupo
router.post('/criar', async(req, res) => {
    let g = req.body;

    await Grupo.criarGrupo(g, res);

});

// Info grupo
router.get('/info/:id', async(req, res) => {
    let id = req.params.id;
    
    await Grupo.infoGrupo(parseInt(id), res);

});

// Atualizar grupo
router.put('/atualizar', async(req, res) => {
    let grupoAtualizado = req.body;
    
    await Grupo.atualizarGrupo(grupoAtualizado, res);
});

// Deletar grupo
router.delete('/deletar', async(req, res) => {
    await Grupo.deletarGrupo(req.params.id, res);
});

// Listar membros do grupo
router.get('/listar-membros', async(req, res) => {
    let idGrupo = req.params.id;

    await Grupo.listarMembros(idGrupo, res);
});

// Listar todos os grupos existentes
router.get('/listar-todos', async(res) => {
    await Grupo.listarTodosOsGrupos(res);
});

// Entrar em um grupo
router.put('/entrar', async(req, res) => {
    let idGrupo = req.params.id;

    await Grupo.entrarEmGrupo(idGrupo, res);
});

module.exports = router;
