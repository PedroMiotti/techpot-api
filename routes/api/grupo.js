'use strict';

// Requerimentos
const express = require('express');
const router = express.Router();
const Grupo = require('../../models/grupo.js');


{/* ROTAS */}
// Criar grupo
router.post('/', async(req, res) => {
    let g = req.body;

    await Grupo.createGroup(g, res);

});

// Listar grupos do usuário
router.get('/user/:id', async(req ,res) => {
    let user_id = req.params.id;

    await Grupo.listUserGroups(user_id, res);

});

// Info grupo
router.get('/group/:id', async(req, res) => {
    let id = req.params.id;
    
    await Grupo.infoGroup(parseInt(id), res);

});

// Editar grupo -- Not working
router.put('/:id', async(req, res) => {
    let group_id = req.params.id;
    
    await Grupo.editGroup(group_id, res);
});

// Deletar grupo -- Not working
router.delete('/:id', async(req, res) => {
    let group_id = req.params.id;

    await Grupo.deleteGroup(group_id, res);
});

// Listar membros do grupo -- Not working
router.get('/members/:id', async(req, res) => {
    let group_id = req.params.id;

    await grupo.listmembers(group_id, res);
});

// Listar todos os grupos existentes -- Not working
router.get('/groups', async(res) => {

    await Grupo.listAllGroups(res);
});

// Entrar em um grupo -- Not working
router.put('/join/group/:id/user/:userid', async(req, res) => {

    let group_id = req.params.id;
    let user_id = req.params.userid;

    await Grupo.joinGroup(group_id, user_id, res);
});

module.exports = router;
