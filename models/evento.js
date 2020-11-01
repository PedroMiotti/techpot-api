"use strict";

// IMPORTS
    // Express
    const express = require('express');
    const router = express.Router();
    const Sql = require('../infra/sql');


class Evento {
    constructor(id, nome, descricao, data_inicio, categoriaId, data_fim,  imagemUrl){
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.data_inicio = data_inicio;
        this.categoriaId = categoriaId;
        //atributos não obrigatorios
        this.data_fim = data_fim;
        this.imagemUrl = imagemUrl;
        

        
    }

    //criar evento
    static async criarEvento(e, res){// data fim vem por ultimo pois não é um parametro obrigatorio
        await Sql.conectar(async (sql) =>{ 
            try{

                /*await sql.query(`INSERT INTO event (event_name, event_desc, event_dateInit, event_img, category_id, event_dateEnd) 
                VALUES (
                    ${e.nome}, 
                    ${e.descricao},
                    ${e.data_inicio}, 
                    ${e.imagemUrl},
                    ${e.categoriaId},
                    ${e.data_fim};`);*/

                await sql.query("INSERT INTO event (event_name, event_desc, event_dateInit, event_img, category_id, event_dateEnd) VALUES (?, ?, ?, ?, ?, ?)", [e.nome, e.descricao, e.data_inicio, e.imagemUrl, e.categoriaId, e.data_fim]);

            }catch(err){

                if (e.code) {
					switch (e.code) {
						case "ER_DUP_ENTRY":
                            message = `Erro ao criar evento`;
                            return res.status(400).send({ message })
							
						default:
							throw e;
					}
				} else {
					throw e;
                }
            }

            return res.status(201).send({
                message: "Evento criado com sucesso!"
            });  
            
        });
        
    }

    //deletar evento
    static async deletarEvento(id, res){
        await Sql.conectar(async (sql) =>{
            await sql.query(`DELETE FROM event WHERE event_id = ${id}`);

        });
    }

    //atualizar evento
    static async atualizarEvento(id, res){};
        


    //listar eventos - lista em ordem de data crescente.
    static async listarEventos(res){
        let lista = [];

        await Sql.conectar(async (sql) =>{
            try{
                lista = await sql.query("SELECT event_id, event_name, event_dateInit, event_img FROM event ORDER BY event_dateInit ASC");
            }
            catch(err){
                return res.status(400).send({ message: "Erro ao listar eventos." })

            }

            return res.status(201).send( lista );  
            

        });

        
    }
        



    //listar inscritos



}


module.exports = Evento;