// IMPORTS
// SQL
const Sql = require("../infra/sql.js");

class Grupo {
  constructor(
    id,
    name,
    description,
    privacy_type,
    image,
    create_date,
    num_members
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.privacy_type = privacy_type;
    this.create_date = create_date;
    this.num_members = num_members;
  }

  // MÉTODOS

  //listar eventos - lista em ordem de data crescente.
  static async listarGrupos(id, res) {
    let lista = [];

    await Sql.conectar(async (sql) => {
      try {
        lista = await sql.query(
          `SELECT g.group_id, g.group_name, g.group_desc, g.group_img, p.privacy_type_name, m.membros
                                        FROM group_pot g 
                                        LEFT JOIN (SELECT group_id, COUNT(user_id) AS membros FROM group_membership GROUP BY group_id) m
                                        ON g.group_id = m.group_id
                                        INNER JOIN group_privacy_type p  
                                        ON g.privacy_type_id = p.privacy_type_id 
                                        WHERE g.group_id IN (SELECT group_id FROM group_membership WHERE user_id = ? )`,
          [parseInt(id)]
        );
      } catch (err) {
        return res.status(400).send({
          message: `Erro ao listar grupos: ${err}`,
        });
      }

      return res.status(201).send(lista);
    });
  }

  // Criar grupo
  static async criarGrupo(g, res) {
    let message;

    await Sql.conectar(async (sql) => {
      try {
        await sql.query(
          "INSERT INTO group_pot (group_name, group_desc, group_img, privacy_type_id) VALUES (?, ?, ?, ?)",
          [g.name, g.description, 1, parseInt(g.privacy_type)]
        );

        const id_grupo = await sql.scalar("SELECT last_insert_id()");

        await sql.query(
          "INSERT INTO group_membership (group_id, user_id, role_id) VALUES (?, ?, ?)",
          [parseInt(id_grupo), g.user_id, 1]
        );
      } catch (e) {
        if (e.code && e.code === "ER_DUP_ENTRY") {
          message = `Eita, o grupo ${g.name} já existe ! :(`;

          return res.status(400).send({ message });
        } else {
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
      let resp = await sql.query(
        `SELECT g.*, COUNT(user_id) AS membros
                                        FROM group_pot g
                                        INNER JOIN group_membership m
                                        ON g.group_id = m.group_id
                                        WHERE g.group_id = ?;`,
        [id]
      );
      let row = resp[0];

      if (!resp || !resp.length)
        return res.status(400).send({ message: "Grupo não encontrado !" });

      let g = new Grupo();
      g.id = row.group_id;
      g.name = row.group_name;
      g.description = row.group_desc;
      g.image = row.group_img;
      g.privacy_type = row.privacy_type_id;
      g.create_date = row.group_create_date;
      g.num_members = row.membros;

      return res.status(200).send({ g });
    });
  }

  // Atualizar grupo
  static async atualizarGrupo(req, res) {
    await Sql.conectar(async (sql) => {
      try {
        await sql.query(
          "UPDATE group SET group_name = ?, group_desc = ?, group_img = ?, group_color = ? WHERE group_id = ?",
          [req.nome, req.descricao, req.foto, req.cor_banner, req.id]
        );
      } catch (err) {
        return res.status(400).send({
          message: `${err} - Erro ao atualizar grupo.`,
        });
      } finally {
        return res.status(201).send({
          message: "Grupo atualizado com sucesso!",
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
          message: `${err} - Erro ao deletar grupo.`,
        });
      } finally {
        return res.status(200).send({
          message: "Grupo deletado com sucesso.",
        });
      }
    });
  }

  // Listar membros
  static async listarMembros(id, res) {
    let membros = [];

    try {
      await sql.query(
        `SELECT user_id FROM group_membership WHERE group_id = ${id}`
      );
    } catch (err) {
      return res.status(400).send({
        message: `${err} - Grupo não encontrado.`,
      });
    } finally {
      return res.status(201).send(membros);
    }
  }

  // Listar todos os grupos existentes na TechPot
  static async listarTodosOsGrupos(res) {
    let grupos = [];

    try {
      await sql.query("SELECT nome, foto FROM group");
    } catch (err) {
      return res.status(400).send({
        message: `${err} - Erro ao listar grupos.`,
      });
    } finally {
      return res.status(201).send(grupos);
    }
  }

  // Entrar em grupo
  static async entrarEmGrupo() {}
}

module.exports = Grupo;
