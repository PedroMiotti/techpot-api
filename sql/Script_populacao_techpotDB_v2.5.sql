-- SCRIPT DE POPULACAO DAS TABELAS - DEV

-- rodar só uma vez (campo email tem restrição unique)
insert into user (user_name , user_username, user_email, user_school_email, user_isstudent)
	values ("fernanda", "fernanda.shinoda", "fernanda.shinoda@mail", "fernanda.shinoda@acad.espm.br",1);
insert into user (user_name , user_username,user_surname,  user_email, user_school_email, user_isstudent)
	values ("pedro", "pedro.miotti",  "pedro.miotti@mail", "pedro.miotti@acad.espm.br",1);
insert into user (user_name , user_username, user_email, user_school_email, user_isstudent)
	values ("joão","joao.kitajima","joao.kitajima@mail", "joao.kitajima@acad.espm.br",1);
-- select * from user;


-- Pop. event_category
INSERT INTO event_category(category_name)
	VALUES("Webinar");
INSERT INTO event_category(category_name)
	VALUES("Hackathon");
INSERT INTO event_category(category_name)
	VALUES("Curso");
-- select * from event_category;


-- Pop. event_type
INSERT INTO event_type(event_type_name)
	VALUES("Online");
INSERT INTO event_type(event_type_name)
	VALUES("Presencial");
-- select * from event_type;


-- Pop. event
INSERT INTO event (event_name, event_desc, event_dateInit, event_img, category_id, event_type_id, event_dateEnd, event_creator_id)
	VALUES ("Hackatruck", "Curso online IBM", "2020-09-27 19:30", "url-x", 3, 1, "2020-10-16 21:00", 1);
INSERT INTO event (event_name, event_desc, event_dateInit, event_img, category_id, event_type_id, event_dateEnd, event_creator_id)
	VALUES ("Hackatech", "Hackathon com a intel que ludibriou todos os alunos de tech", "2020-11-03 00:00", "url-y", 2, 1, "2020-11-11 23:59",2);
INSERT INTO event (event_name, event_desc, event_dateInit, event_img, category_id, event_type_id, event_dateEnd, event_creator_id)
	VALUES ("Webinar LGPD", "Webinar para saber mais sobre a nova Lei Geral de Proteção de Dados", "2020-12-09 20:00", "url-x", 3, 1, "2020-12-09 22:00", 3);
-- select * from event;


-- Pop. group_privacy_type
INSERT INTO group_privacy_type (privacy_type_id, privacy_type_name) VALUES (1, 'Publico');
INSERT INTO group_privacy_type (privacy_type_id, privacy_type_name) VALUES (2, 'Privado');
-- select * from group_privacy_type;


-- Pop. group_role_type
INSERT INTO group_role_type (role_id, role_name) VALUES (1, 'Administrador');
INSERT INTO group_role_type (role_id, role_name) VALUES (2, 'Moderador');
INSERT INTO group_role_type (role_id, role_name) VALUES (3, 'Membro');
-- select * from group_role_type;


-- Pop. group_pot
INSERT INTO group_pot (group_name, group_desc, group_members_count, group_img, privacy_type_id, group_create_date)
	VALUES ("TECH", "Grupo aberto para todos", 3, "url-a", 002, "2020-11-01");
INSERT INTO group_pot (group_name, group_desc, group_members_count, group_img, privacy_type_id, group_create_date)
	VALUES ("Overbite - CS", "Grupo para o time de CS" , 1, "url-b", 001, "2020-12-01");
INSERT INTO group_pot (group_name, group_desc, group_members_count, group_img, privacy_type_id, group_create_date)
	VALUES ("Programação Competitiva", "Grupo super secreto ", 1, "url-c", 002, "2020-01-01");
-- select * from group_pot;


-- Pop. groupt_membership
INSERT group_membership (group_id, user_id, role_id)
	VALUES(1, 1, 1);
INSERT group_membership (group_id, user_id, role_id)
	VALUES(1, 2, 1);
INSERT group_membership (group_id, user_id, role_id)
	VALUES(1, 3, 1);
INSERT group_membership (group_id, user_id, role_id)
	VALUES(2, 2, 1);
INSERT group_membership (group_id, user_id, role_id)
	VALUES(3, 3, 1);
-- select * from group_membership;
