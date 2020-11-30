'use strict';

// Requerimentos
const express = require('express');
const router = express.Router();
const grupo = require('../models/grupo.js');


{/* ROTAS */}
// Listar grupos do usuário
router.get('/listar', async(res) => {
    await grupo.listarGrupos(res);
});

// Criar grupo
router.post('/criar', async(req, res) => {
    let novoGrupo = req.body;
    
    await grupo.criarGrupo(novoGrupo, res);
});

// Atualizar grupo
router.put('/atualizar', async(req, res) => {
    let grupoAtualizado = req.body;
    
    await grupo.atualizarGrupo(grupoAtualizado, res);
});

// Deletar grupo
router.delete('/deletar', async(req, res) => {
    await grupo.deletarGrupo(req.params.id, res);
});

// Listar membros do grupo
router.get('/listar-membros', async(req, res) => {
    let idGrupo = req.params.id;

    await Grupo.listarMembros(idGrupo, res);
});

// Listar todos os grupos existentes
router.get('/listar-todos', async(res) => {
    await grupo.listarTodosOsGrupos(res);
});

// Entrar em um grupo
router.put('/entrar', async(req, res) => {
    let idGrupo = req.params.id;

    await grupo.entrarEmGrupo(idGrupo, res);
});

module.exports = router;
