'use strict';

const { parseConnectionUrl } = require('nodemailer/lib/shared');
const Sql = require('../infra/sql.js');

const format_date = require('../utils/format_date');

class Grupo {
    constructor(id, nome, descricao, tipo_privacidade, foto, data_criacao, num_membros) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.foto = foto;
        this.tipo_privacidade = tipo_privacidade;
        this.data_criacao = data_criacao;
        this.num_membros = num_membros;
    }

    // MÉTODOS

    //listar eventos - lista em ordem de data crescente. 
    static async listarGrupos(id, res) {
        let lista = [];

        await Sql.conectar(async (sql) => {
            try {

                lista = await sql.query(`SELECT g.group_id, g.group_name, g.group_descricao, g.group_img, p.privacy_type_name, m.membros
                                        FROM group_pot g 
                                        LEFT JOIN (SELECT group_id, COUNT(user_id) AS membros FROM group_membership GROUP BY group_id) m
                                        ON g.group_id = m.group_id
                                        INNER JOIN group_privacy_type p  
                                        ON g.privacy_type_id = p.privacy_type_id 
                                        WHERE g.group_id IN (SELECT group_id FROM group_membership WHERE user_id = ? )`, [parseInt(id)]);

            }

            catch (err) {
                return res.status(400).send({
                    message: `Erro ao listar grupos: ${err}`
                })

            }

            return res.status(201).send(lista);

        });

    }

    // Criar grupo
    static async criarGrupo(g, res) {

        let message;

        let date_now = format_date(new Date().toISOString());

        await Sql.conectar(async (sql) => {
            try {

                await sql.query('INSERT INTO group_pot (group_name, group_descricao, group_img, privacy_type_id, group_data_criacao) VALUES (?, ?, ?, ?, ?)', [g.nome, g.descricao, 1, parseInt(g.tipo_privacidade), date_now]);

                const id_grupo = await sql.scalar("SELECT last_insert_id()");

                await sql.query('INSERT INTO group_membership (group_id, user_id, role_id) VALUES (?, ?, ?)', [parseInt(id_grupo), g.user_id, 1]);

            } catch (e) {

                if (e.code && e.code === "ER_DUP_ENTRY") {

                    message = `Eita, o grupo ${g.nome} já existe ! :(`;

                    return res.status(400).send({ message });
                }

                else {
                    throw e;
                }

            }

            return res.status(201).send({ message: "Grupo criado com sucesso !" });
        });
    }

    // Info Grupo 
    static async infoGrupo(id, res) {

        if (!id) return res.status(400).send({ message: "Grupo não encontrado !" });

        await Sql.conectar(async (sql) => {
            let resp = await sql.query(`SELECT g.*, COUNT(user_id) AS membros
                                        FROM group_pot g
                                        INNER JOIN group_membership m
                                        ON g.group_id = m.group_id
                                        WHERE g.group_id = ?;`, [id]);
            let row = resp[0];

            if (!resp || !resp.length) return res.status(400).send({ message: "Grupo não encontrado !" })

            let g = new Grupo;
            g.id = row.group_id;
            g.nome = row.group_name;
            g.descricao = row.group_descricao;
            g.foto = row.group_img;
            g.tipo_privacidade = row.privacy_type_id;
            g.data_criacao = row.group_data_criacao;
            g.num_membros = row.membros;

            return res.status(200).send({ g });

        })
    }


    // Atualizar grupo
    static async atualizarGrupo(req, res) {
        await Sql.conectar(async (sql) => {
            try {
                await sql.query('UPDATE group SET group_name = ?, group_desc = ?, group_img = ?, group_color = ? WHERE group_id = ?', [req.nome, req.descricao, req.foto, req.cor_banner, req.id]);
            } catch (err) {
                return res.status(400).send({
                    message: `${err} - Erro ao atualizar grupo.`
                });
            } finally {
                return res.status(201).send({
                    message: "Grupo atualizado com sucesso!"
                });
            }
        });
    }

    // Deletar grupo
    static async deletarGrupo(id, res) {
        await Sql.conectar(async (sql) => {
            try {
                await sql.query(`DELETE FROM group WHERE group_id = ${id}`);
            } catch (err) {
                return res.status(400).send({
                    message: `${err} - Erro ao deletar grupo.`
                });
            } finally {
                return res.status(200).send({
                    message: "Grupo deletado com sucesso."
                });
            }
        });
    }

    // Listar membros
    static async listarMembros(id, res) {
        let membros = [];

        try {
            await sql.query(`SELECT user_id FROM group_membership WHERE group_id = ${id}`);
        } catch (err) {
            return res.status(400).send({
                message: `${err} - Grupo não encontrado.`
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
        } catch (err) {
            return res.status(400).send({
                message: `${err} - Erro ao listar grupos.`
            });
        } finally {
            return res.status(201).send(grupos);
        }
    }

    // Entrar em grupo
    static async entrarEmGrupo() { }
}

module.exports = Grupo;
