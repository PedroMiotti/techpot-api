'use strict';

const sql = require('../infra/sql.js');

class Grupo {
    constructor(id, nome, descricao, criador_id, foto, cor_banner, data_criacao, usuario) {
        // Grupo
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.criador_id = criador_id;
        this.foto = foto;
        this.cor_banner = cor_banner;
        this.data_criacao = data_criacao;

        // Afiliação de grupos
        this.usuario = usuario;
    }

    // MÉTODOS
    // Listar grupos
    static async listarGrupos(usuario, res) {
        let grupos = [];
        
        try {
            await sql.query(`SELECT nome, foto, usuario FROM group INNER JOIN group_list ON group_list.group_id = group.group_id WHERE user_id = ${usuario}`);
        } catch(err) {
            return res.status(400).send({
                message: `${err} - Erro ao listar grupos.`
            });
        } finally {
            return res.status(201).send(grupos);
        }
    }

    // Criar grupo
    static async criarGrupo(req, res) {
        await Sql.conectar(async(sql) => {
            try {
                await sql.query('INSERT INTO group (group_name, group_desc, group_img, group_creator_id, group_roles, group_color) VALUES (?, ?, ?, ?, ?, ?)', [req.nome, req.descricao, req.criador_id, req.foto, req.cor_banner, req.data_criacao]);
            } catch(err) {
                return res.status(400).send({
                    message: `${err} - Erro ao criar grupo.`
                })
            } finally {
                return res.status(201).send({
                    message : "Grupo criado com sucesso!"
                });
            }
        });
    }

    // Atualizar grupo
    static async atualizarGrupo(req, res) {
        await Sql.conectar(async(sql) => {
            try {
                await sql.query('UPDATE group SET group_name = ?, group_desc = ?, group_img = ?, group_color = ? WHERE group_id = ?', [req.nome, req.descricao, req.foto, req.cor_banner, req.id]);
            } catch(err) {
                return res.status(400).send({
                    message : `${err} - Erro ao atualizar grupo.`
                });
            } finally {
                return res.status(201).send({
                    message : "Grupo atualizado com sucesso!"
                });
            }
        });
    }

    // Deletar grupo
    static async deletarGrupo(id, res) {
        await Sql.conectar(async(sql) => {
            try {
                await sql.query(`DELETE FROM group WHERE group_id = ${id}`);
            } catch(err) {
                return res.status(400).send({
                    message : `${err} - Erro ao deletar grupo.`
                });
            } finally {
                return res.status(200).send({
                    message : "Grupo deletado com sucesso."
                });
            }
        });
    }

    // Listar membros
    static async listarMembros(id, res) {
        let membros = [];

        try {
            await sql.query(`SELECT user_id FROM group_membership WHERE group_id = ${id}`);
        } catch(err) {
            return res.status(400).send({
                message : `${err} - Grupo não encontrado.` 
            });
        } finally {
            return res.status(201).send(membros);
        }
    }

    // Listar todos os grupos existentes na TechPot
    static async listarTodosOsGrupos(res) {
        let grupos = [];

        try {
            await sql.query('SELECT nome, foto FROM group');
        } catch(err) {
            return res.status(400).send({
                message: `${err} - Erro ao listar grupos.`
            });
        } finally {
            return res.status(201).send(grupos);
        }
    }

    // Entrar em grupo
    static async entrarEmGrupo() {}
}

module.exports = Grupo;
