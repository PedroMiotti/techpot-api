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

    let message;

    await Sql.conectar(async (sql) => {
      try {
        await sql.query(
          "INSERT INTO post (post_body, post_body_html, user_id, group_id) VALUES (?, ?, ?, ?)",
          [p.post_body, p.post_body_html, p.user_id, parseInt(p.group_id)]
        );

        message = "Post criado com sucesso !";
      } catch (e) {
        return res.status(400).send({
          message: `Erro ao listar posts: ${e}`,
        });
      }

      return res.status(201).send({ message });
    });
  }

  static async listPostsByUser(user_id, res) {
    let listPosts = [];
    let postsUserLiked = []; 
    let postUserLikedParsed;

    await Sql.conectar(async (sql) => {
      try {
        listPosts = await sql.query(
          `SELECT p.post_id, p.post_body, p.post_body_html, p.post_like_count ,p.post_create_date, g.group_name, u.user_id,u.user_name
                                FROM post p
                                INNER JOIN user u 
                                ON p.user_id = u.user_id
                                INNER JOIN group_pot g
                                ON p.group_id = g.group_id
                                WHERE g.group_id IN (SELECT group_id FROM group_membership WHERE user_id = ? ) 
                                ORDER BY p.post_id DESC`,
          [parseInt(user_id)]
        );
    
        postsUserLiked = await sql.query(`SELECT post_id FROM like_post WHERE user_id = ?`, [user_id]);

        postUserLikedParsed = postsUserLiked.map((item, index) => (item.post_id))

      } catch (e) {
        return res.status(400).send({
          message: `Erro ao listar posts: ${e}`,
        });
      }

      return res.status(201).send( { listPosts, postUserLikedParsed} );
    });
  }

  static async listPostsByGroup(group_id, res) {
    let lista = [];

    await Sql.conectar(async (sql) => {
      try {
        lista = await sql.query(
          `SELECT p.post_id, p.post_body, p.post_body_html, p.post_create_date, p.post_like_count, g.group_name, u.user_id, u.user_name
                                        FROM post p
                                        INNER JOIN user u 
                                        ON p.user_id = u.user_id
                                        INNER JOIN group_pot g
                                        ON p.group_id = g.group_id
                                        WHERE p.group_id = ?
                                        ORDER BY p.post_id DESC;`,
          [parseInt(group_id)]
        );
      } catch (e) {
        return res.status(400).send({
          message: `Erro ao listar posts: ${err}`,
        });
      }

      return res.status(201).send(lista);
    });
  }

  static async likePost(user_id, post_id, res){
  
    if(!user_id || !post_id) return res.status(400).send({message : 'Ops algo deu errado'});

    await Sql.conectar(async (sql) => {
      
      try{
        
        await sql.query(`INSERT INTO like_post (post_id, user_id) VALUES (?, ?)`, [post_id, user_id]);

        await sql.query(`UPDATE post SET post_like_count = (SELECT COUNT(*) FROM like_post WHERE post_id = ?) WHERE post_id = ? `, [post_id, post_id]); 
      }
      catch(e){
        
        console.log(e);
  
      }

      return res.status(200).send('Post Liked');

    }) 
  }

  static async unlikePost(user_id, post_id, res){
    
    if(!user_id || !post_id) return res.status(400).send({message : 'Ops algo deu errado ... unlikePostFunction'});

    await Sql.conectar(async (sql) => {
      
      try{
        
        await sql.query(`DELETE FROM like_post WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);

        await sql.query(`UPDATE post SET post_like_count = (SELECT COUNT(*) FROM like_post WHERE post_id = ?) WHERE post_id = ? `, [post_id, post_id]); 
      }
      catch(e){
        console.log(e);
      }

      return res.status(204).send('Post unliked');
      

    })
  }

}
module.exports = Post;
