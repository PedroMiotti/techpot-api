"use strict";

// IMPORTS
//Dotenv
require("dotenv").config();
// SQL
const Sql = require("../infra/sql");

class Post {
  constructor(id, user_id, group_id, post_body, post_body_html) {
    this.id = id;
    this.user_id = user_id;
    this.group_id = group_id;
    this.post_body = post_body;
    this.post_body_html = post_body_html;
  }

  // --> Criar post
  static async createPost(p, res) {
    // TODO --> Validate if the user really belongs to that group

    await Sql.conectar(async (sql) => {
      try {
        await sql.query(
          "INSERT INTO post (post_body, post_body_html, user_id, group_id, post_comment_count, post_like_count) VALUES (?, ?, ?, ?, ?, ?)",
          [p.post_body, p.post_body_html, p.user_id, parseInt(p.group_id), 0, 0]
        );

      } catch (e) {
        return res.status(400).send({
          message: `Erro ao listar posts: ${e}`,
        });
      }

      return res.status(201).send({ message: "Post criado com sucesso !" });
    });
  }

  static async listPostsByUser(user_id, res) {
    let listPosts = [];
    let postsUserLiked = []; 
    let postUserLikedParsed;

    await Sql.conectar(async (sql) => {
      try {
        listPosts = await sql.query("SELECT p.post_id, p.post_body, p.post_body_html, p.post_like_count, p.post_comment_count ,p.post_create_date, g.group_name, u.user_id, u.user_name, c.comment_id, c.comment_body, c.comment_date, uc.user_id as comment_user_id, uc.user_name as comment_user_name\n" +
            "FROM post p\n" +
            "INNER JOIN user u \n" +
            "ON p.user_id = u.user_id\n" +
            "INNER JOIN group_pot g\n" +
            "ON p.group_id = g.group_id\n" +
            "INNER JOIN (SELECT MAX(comment_date) as comment_date, comment_id, comment_body, user_id, post_id FROM comment_post group by post_id) c\n" +
            "ON p.post_id = c.post_id\n" +
            "INNER JOIN user uc\n" +
            "ON c.user_id = uc.user_id\n" +
            "WHERE g.group_id IN (SELECT group_id FROM group_membership WHERE user_id = ? ) \n" +
            "ORDER BY p.post_id DESC;\n",
          [parseInt(user_id)]
        );
    
        postsUserLiked = await sql.query(`SELECT post_id FROM like_post WHERE user_id = ?`, [user_id]);

        postUserLikedParsed = postsUserLiked.map((item, index) => (item.post_id));

      } catch (e) {
        return res.status(400).send({
          message: `Erro ao listar posts: ${e}`,
        });
      }

      return res.status(201).send( { listPosts, postUserLikedParsed} );
    });
  }

  static async listPostsByGroup(group_id, res) {
    let post_list = [];

    // TODO -> Add validation if the group exists
    await Sql.conectar(async (sql) => {
      try {
        post_list = await sql.query("SELECT p.post_id, p.post_body, p.post_body_html, p.post_create_date, p.post_like_count, g.group_name, u.user_id, u.user_name, c.comment_id, c.comment_body, c.comment_date, uc.user_id as comment_user_id, uc.user_name as comment_user_name\n" +
            "FROM post p\n" +
            "INNER JOIN user u \n" +
            "ON p.user_id = u.user_id\n" +
            "INNER JOIN group_pot g\n" +
            "ON p.group_id = g.group_id\n" +
            "INNER JOIN (SELECT MAX(comment_date) as comment_date, comment_id, comment_body, user_id, post_id FROM comment_post group by post_id) c\n" +
            "ON p.post_id = c.post_id\n" +
            "INNER JOIN user uc\n" +
            "ON c.user_id = uc.user_id\n" +
            "WHERE p.group_id = 2\n" +
            "ORDER BY p.post_create_date ASC;",
          [parseInt(group_id)]
        );

      } catch (e) {
        return res.status(400).send({message: `Erro ao listar posts: ${e}`,});
      }

      return res.status(201).send(post_list);
    });
  }

  static async likePost(user_id, post_id, res){
  
    if(!user_id || !post_id) return res.status(400).send({message : 'Ops algo deu errado'});

    // TODO -> Add validation if the post and the user exists
    await Sql.conectar(async (sql) => {
      
      try{
        
        await sql.query(`INSERT INTO like_post (post_id, user_id) VALUES (?, ?)`, [parseInt(post_id), parseInt(user_id)]);

        await sql.query(`UPDATE post SET post_like_count = post_like_count + 1 WHERE post_id = ? `, [ post_id]);
      }
      catch(e){
        console.log(e);
        return res.status(500).send(e);

      }

      return res.status(200).send('Post Liked');

    }) 
  }

  static async unlikePost(user_id, post_id, res){
    
    if(!user_id || !post_id) return res.status(400).send({message : 'Missing information'});

    // TODO -> Add validation if the post and the user exists
    await Sql.conectar(async (sql) => {
      
      try{
        
        await sql.query(`DELETE FROM like_post WHERE user_id = ? AND post_id = ?`, [parseInt(user_id), parseInt(post_id)]);

        await sql.query(`UPDATE post SET post_like_count = post_like_count - 1 WHERE post_id = ? `, [post_id]);
      }
      catch(e){
        console.log(e);
        return res.status(500).send(e);
      }

      return res.status(200).send('Post unliked');
      

    })
  }

  static async createComment(user_id, post_id, body, res){

    if(!user_id || !post_id || !body) return res.status(400).send({message : 'Missing information'});

    // TODO -> Add validation if the post and the user exists
    await Sql.conectar(async (sql) => {

      try{

        await sql.query("UPDATE post SET post_comment_count = post_comment_count + 1 WHERE post_id = ?", [post_id]);

        await sql.query(`INSERT INTO comment_post (comment_body, post_id, user_id) VALUES (?, ?, ?)`, [body, post_id, user_id]);

      }
      catch(e){
        console.log(e);
        return res.status(500).send(e);
      }

      return res.status(200).send('Comment OK');

    })
  }

  static async getCommentsByPost(post_id, res){
    let comments = [];
    if(!post_id) return res.status(400).send({message: "Missing post Id"})

    await Sql.conectar((async (sql) => {
      try{

        // TODO -> Pagination
        comments = await sql.query("SELECT c.* , uc.user_id, uc.user_name\n" +
            "FROM comment_post c\n" +
            "INNER JOIN user uc\n" +
            "ON c.user_id = uc.user_id\n" +
            "WHERE c.post_id = ? \n" +
            "ORDER BY c.comment_date DESC;", [post_id]);

      }
      catch(e){
        return res.status(500).send(e);
      }

      return res.status(200).send(comments);
    }))
  }

}
module.exports = Post;
