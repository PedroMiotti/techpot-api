"use strict";

// IMPORTS
    // Express
    const express = require('express');
    const router = express.Router();
    //JWT
    const jwt = require('jsonwebtoken');
    //BcryptJs
    const bcrypt = require('bcryptjs');


class Usuario {
    constructor(id, nome, nomeUsuario, email, senha, foto ,ocupacao, linkedin, github, instagram){
        this.id = id;
        this.nome = nome;
        this.nomeUsuario = nomeUsuario;
        this.email = email;
        this.senha = senha;
        this.ocupacao = ocupacao;
        this.foto = foto;
        this.linkedin = linkedin;
        this.github = github;
        this. instagram = instagram;
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
            u.login = row.user_login;
            u.nome = row.user_nome;

            const token = jwt.sign({ u }, process.env.JWT_SECRET, { expiresIn: 31536000 })

            return res.status(200).send({ token })

        })
    
    }



}



module.exports = Usuario;



