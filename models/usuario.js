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
//Helpers
const sendConfirmationEmail = require('../helpers/AuthEmail');


class Usuario {
    constructor(id, nome, sobrenome, bio, email, senha, img, ocupacao, linkedin, github, instagram) {
        this.id = id;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.bio = bio;
        this.email = email;
        this.senha = senha;
        this.ocupacao = ocupacao;
        this.img = img;
        this.linkedin = linkedin;
        this.github = github;
        this.instagram = instagram;
    }


    // --> Gerar token 
    static genToken(id, nome) {

        let u = new Usuario;
        u.id = id;
        u.nome = nome;

        const token = jwt.sign({ u }, process.env.JWT_SECRET, { expiresIn: 31536000 })

        return token;

    }

    // --> Efetuar login
    static async login(email, senha, res) {

        if (!email || !senha) return res.status(400).send({ message: "Usuário ou senha inválidos ! :(" });


        await Sql.conectar(async (sql) => {

            let resp = await sql.query("SELECT user_id, user_name, user_password FROM user WHERE user_mail = ? ", [email]);
            let row = resp[0];


            if (!resp || !resp.length) return res.status(400).send({ message: "Usuário ou senha inválidos ! :(" })


            const validPassword = bcrypt.compare(senha, row.user_password);
            if (!validPassword) return res.status(400).send({ message: "Usuário ou senha inválidos ! :(" });

            const token = Usuario.genToken(row.user_id, row.user_name);

            return res.status(200).send({ token })

        })

    }

    // --> Criar usuario
    static async createUser(u, res) {

        /*

            TODO --> Form validation
            TODO --> Email validation ( Front ? )
            TODO --> Check if email exists on DB and treat duplicate error
            TODO --> Password validation ( Front ? )
            TODO --> Send error message if the email is not found -- Error: No recipients defined (NodeMailer error)
            ? REQUIRED FIELDS --> Nome, sobrenome, email, senha;

        */

        let message;
        let statusCode;
        let token;

        await Sql.conectar(async (sql) => {
            try {

                let hash = bcrypt.hashSync(u.senha, parseInt(process.env.SALT_ROUNDS));

                await sql.query("INSERT INTO user (user_name, user_surname,user_password, user_mail, user_img, user_bio, user_job, user_git, user_linkedin, user_instagram) VALUES(?, ? ,?, ?, ?, ?, ?, ?, ?, ?)", [u.nome, u.sobrenome, hash, u.email, 1, u.bio, u.ocupacao, u.github, u.linkedin, u.instagram])

                // sendConfirmationEmail(u.email);

                token = Usuario.genToken(sql.lastInsertedId, u.nome);
                statusCode = 201;
                message = `Bem vindo a comunidade TECH ${u.nome} !`;


            } catch (e) {
                if (e.code && e.code === "ER_DUP_ENTRY") {

                    message = `Opsss, o email ${u.email} já está em uso, deseja fazer login ou recuperar sua senha ?`;
                    token = null;
                    statusCode = 400;
                }

                else {
                    throw e;
                }
            }

            return res.status(statusCode).send({ token, message });
        });

    }

    // --> Excluir conta
    static async deleteAccount(res, id) {

        if (!id) return res.status(400).send({ message: "Usuário não encontrado !" });

        await Sql.conectar(async (sql) => {
            await sql.query("DELETE FROM usuario WHERE user_id = ? ", [id]);

            if (sql.linhasAfetadas === 0) return res.status(400).send({ message: "Usuário não encontrado !" })

            return res.status(200).send({ message: "Usuário excluido com successo !" })
        })

    }


    // --> Info Usuario 
    static async infoUser(id, res) {

        if (!id) return res.status(400).send({ message: "Usuário não encontrado !" });

        await Sql.conectar(async (sql) => {
            let resp = await sql.query("SELECT * FROM user WHERE user_id = ?", [id]);
            let row = resp[0];

            if (!resp || !resp.length) return res.status(400).send({ message: "Usuário não encontrado !" })

            let u = new Usuario;
            u.nome = row.user_name;
            u.sobrenome = row.user_surname;
            u.bio = row.user_bio;
            u.email = row.user_mail;
            u.ocupacao = row.user_job;
            u.github = row.user_git;
            u.instagram = row.user_instagram;
            u.linkedin = row.user_linkedin;

            return res.status(200).send({ u })

        })
    }


    // --> Editar Usuario
    static async updateUser(u, res) {
        let message;
        let statusCode;
        let token;

        // if(!u.id) return res.status(400).send({message: "Usuário não encontrado !"});

        await Sql.conectar(async (sql) => {
            let id = parseInt(u.id);
            await sql.query("UPDATE user SET user_name = ?, user_surname = ?, user_bio = ?, user_job= ?, user_git = ?, user_linkedin = ? WHERE user_id = ?", [u.nome, u.sobrenome, u.bio, u.ocupacao, u.github, u.linkedin, id]);

            token = Usuario.genToken(id, u.nome);
            statusCode = 200;
            message = "Usuario salvo com sucesso !";


            return res.status(200).send({ token, message })


        })


    }

    // --> Confirmar E-mail
    static async updateEmailStatus() {


        // Update on DB email status 0 --> 1

    }


}



module.exports = Usuario;



