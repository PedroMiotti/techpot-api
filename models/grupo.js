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
    num_members,
    members_list

  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.privacy_type = privacy_type;
    this.create_date = create_date;
    this.num_members = num_members;
    this.members_list = members_list;
  }

  // MÉTODOS

  //listar grupos
  static async listUserGroups(id, res) {
    let lista = [];

    await Sql.conectar(async (sql) => {
      try {
        lista = await sql.query(
          `SELECT g.group_id, g.group_name, g.group_desc, g.group_img, g.group_members_count ,p.privacy_type_name
                                        FROM group_pot g 
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
  static async createGroup(g, res) {
    let message;

    await Sql.conectar(async (sql) => {
      try {
        await sql.query(
          "INSERT INTO group_pot (group_name, group_desc, group_members_count, group_img, privacy_type_id) VALUES (?, ?, ?, ?, ?)",
          [g.name, g.description, 1, 1, parseInt(g.privacy_type)]
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
  static async infoGroup(id, res) {
    if (!id) return res.status(400).send({ message: "Grupo não encontrado !" });

    await Sql.conectar(async (sql) => {
      let resp = await sql.query("SELECT * FROM group_pot WHERE group_id = ?", [id]);
      let row = resp[0];

      let g_members = await sql.query(`SELECT m.role_id, u.user_name, u.user_username, u.user_id, u.user_img
                                      FROM group_membership m
                                      INNER JOIN user u 
                                      ON u.user_id = m.user_id
                                      WHERE m.group_id = 2;`)

      if (!resp || !resp.length)
        return res.status(400).send({ message: "Grupo não encontrado !" });
 
      let g = new Grupo();
      g.id = row.group_id;
      g.name = row.group_name;
      g.description = row.group_desc;
      g.image = row.group_img;
      g.privacy_type = row.privacy_type_id;
      g.create_date = row.group_create_date;
      g.num_members = row.group_members_count;
      g.members_list = g_members;

      return res.status(200).send({ g });
    });
  }

  // Not working - TODO --> Fix
  // Atualizar grupo
  static async editGroup(id, g, res) {
    await Sql.conectar(async (sql) => {
      try {
        await sql.query(
          "UPDATE group SET group_name = ?, group_desc = ?, group_img = ?, group_color = ? WHERE group_id = ?",
          [g.nome, g.descricao, g.foto, g.cor_banner, g.id]
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
  static async deleteGroup(id, res) {
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

  // Listar membros -- Not working
  static async listMembers(id, res) {
    let membros = [];

    try {
      await sql.query(
        `SELECT user_id FROM group_membership WHERE group_id = ${id}`
      );
    } catch (err) {
      return res
        .status(400)
        .send({ message: `${err} - grupo não encontrado.` });
    }

    return res.status(201).send(membros);
  }

  // Listar todos os grupos existentes -- Not working 
  static async listAllGroups(res) {
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

  // Entrar em grupo -- Not working
  static async joinGroup() {}
}

module.exports = Grupo;
