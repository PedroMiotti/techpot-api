"use strict";

// IMPORTS
    // Express
    const express = require('express');
    //JWT
    const jwt = require('jsonwebtoken');
    //Dotenv
    require('dotenv').config();
    //BcryptJs
    const bcrypt = require('bcryptjs');
    // SQL
    const Sql = require('../infra/sql');


class Usuario {
    constructor(id, nome, bio, email, senha, img ,ocupacao, linkedin, github, instagram){
        this.id = id;
        this.nome = nome;
        this.bio = bio;
        this.email = email;
        this.senha = senha;
        this.ocupacao = ocupacao;
        this.img = img;
        this.linkedin = linkedin;
        this.github = github;
        this.instagram = instagram;
    }



    // --> Efetuar login
    static async login(usuario, senha, res){

        if(!usuario || !senha) return res.status(400).send({message : "Usuário ou senha inválidos ! :("});
        
        await Sql.conectar(async (sql) => {

            let resp = await sql.query("QUERY", [usuario]);
            let row = resp[0];

            if(!resp || !resp.length) return res.status(400).send({message : "Usuário ou senha inválidos ! :("})


            const validPassword = await bcrypt.compare(senha, row.user_senha)
            if (!validPassword) return res.status(400).send({message : "Usuário ou senha inválidos ! :("});

            let u = new Usuario;
            u.id = row.user_id;
            u.nome = row.user_nome;

            const token = jwt.sign({ u }, process.env.JWT_SECRET, { expiresIn: 31536000 })

            return res.status(200).send({ token })

        })
    
    }

    // --> Criar usuario
    static async createUser(u, res) {

        // TODO --> Form validation
        // TODO --> Email validation ( Front ? )
        // TODO --> Check if email exists on DB
        // TODO --> Password validation ( Front ? )


        let message;
        
        await Sql.conectar(async (sql) => {
            
            try{
                bcrypt.hash(u.senha, parseInt(process.env.SALT_ROUNDS), async function(err, hash){
                    if(err) throw err;
                        
                    await sql.query("INSERT INTO user (user_name, user_password, user_mail, user_img, user_bio, user_job, user_git, user_linkedin, user_instagram) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [u.nome, hash, u.email, 1, u.bio, u.ocupacao, u.github, u.linkedin, u.instagram ])        
                    
                    // TODO --> Send confirmation email
        
                });
            }
            catch (e) {
				if (e.code) {
					switch (e.code) {
						case "ER_DUP_ENTRY":
                            message = `O email ${u.email} já está em uso, deseja recuperar sua senha ?`;
                            return res.status(400).send({ message })
							
						default:
							throw e;
					}
				} else {
					throw e;
				}
            }

            return res.status(201).send({ message: `Usuário criado com sucesso ! ` })
        })


    }

    // --> Confirmar E-mail
    static async updateEmailStatus(){


        // Update on DB email status 0 --> 1

    }


}



module.exports = Usuario;



