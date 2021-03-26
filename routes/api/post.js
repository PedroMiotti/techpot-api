"use strict";

// IMPORTS
// Express
const express = require('express');
const router = express.Router();

//MODEL
const Post = require('../../models/post');


// ROTAS
// --> Criar Post
router.post("/", async (req, res) => {
    let p = req.body;
  
    await Post.createPost(p, res);

})

// --> Listar posts para o feed do usuario
router.get("/feed/user/:id", async (req, res) => {
    let id = req.params.id;

    await Post.listPostsByUser(id, res);
})

// --> Listar posts para feed do grupo
router.get("/feed/group/:id", async (req, res) => {
    let id = req.params.id;

    await Post.listPostsByGroup(id, res);
})

// --> Like post
router.post('/like/post/:id/user/:userid', async (req, res) => {

  let post_id = req.params.id;
  let user_id = req.params.userid;
  
  await Post.likePost(user_id, post_id, res);


})

// --> unlike post
router.put('/unlike/post/:id/user/:userid', async (req, res) => {
  let post_id = req.params.id;
  let user_id = req.params.userid;
  
  await Post.unlikePost(user_id, post_id, res);


})


module.exports = router;
