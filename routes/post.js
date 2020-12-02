"use strict";

// IMPORTS
// Express
const express = require('express');
const router = express.Router();

//MODEL
const Post = require('../models/post');


// ROTAS


// --> Criar Post
router.post("/criar", async (req, res) => {
    let p = req.body;

    await Post.createPost(p, res);

})

// --> Listar posts para o feed do usuario
router.get("/feed/listar/:id", async (req, res) => {
    let id = req.params.id;

    await Post.listPostsByUser(id, res);
})

// --> Listar posts para feed do grupo
router.get("/feed/grupo/listar/:id", async (req, res) => {
    let id = req.params.id;

    await Post.listPostsByGroup(id, res);
})


module.exports = router;