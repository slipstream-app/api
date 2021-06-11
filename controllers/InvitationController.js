const sequelize = require("../models").sequelize;
const Sequelize = require("../models").Sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);
module.exports = {
    async list(req, res) {
        try {
            const invitations = await models.invitations.findAll({
                where: {
                    user_id: req.user.id,
                },
                include: [
                    {
                        model: models.races,
                        as: "race",
                        include: {
                            model: models.users,
                            as: "leader",
                        },
                    },
                ],
            });
            return res.json(invitations);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: "Server error",
            });
        }
    },
    async show(req, res) {
        try {
            const user = await models.races.findByPk(req.params.id);
            return res.json(user);
        } catch (err) {
            return console.err("Erro na busca: ", err);
        }
    },
    async create(req, res) {
        try {
            const Op = Sequelize.Op;

            let race = await models.races.findOne({
                where: {
                    id: req.body.race_id,
                    leader_id: req.user.id,
                },
            });

            if (!race)
                return res.status(404).json({
                    msg: "Race not found",
                });

            if (race.leader_id != req.user.id) {
                return res.status(403).json({
                    msg: "Not the race leader",
                });
            }

            let previousInvitation = await models.invitations.findOne({
                where: {
                    race_id: race.id,
                    user_id: req.user.id,
                    status: {
                        [Op.not]: 3,
                    },
                },
            });

            if (previousInvitation)
                return res.status(422).json({
                    msg: "Invitation already exists",
                });

            const user = await models.users.findByPk(req.body.user_id);

            if (!user)
                return res.status(404).json({
                    msg: "User not found",
                });

            const invitation = await models.invitations.create({
                race_id: race.id,
                user_id: user.id,
                status_id: 1,
            });

            return res.status(201).json(invitation);
        } catch (error) {
            //todo global error handling
            console.error("Erro na criação", error);
            return res.status(422).json({
                error: "Campos Inválidos",
            });
        }
    },

    async update(req, res) {
        const Sequelize = require("sequelize");
        const Op = Sequelize.Op;
        const { title, poster, overview } = req.body;
        const id = req.params.id;
        try {
            await models.races.update(
                {
                    title,
                    poster,
                    overview,
                },
                {
                    where: {
                        id: {
                            [Op.eq]: id,
                        },
                    },
                }
            );
            return res.json({
                msg: `Filme ${title} atualizado com sucesso!`,
            });
        } catch (error) {
            return res.json(
                {
                    msg: `Filme ${title} não foi atualizado`,
                },
                err
            );
        }
    },
    async delete(req, res) {
        try {
            await models.races.destroy({
                where: {
                    id: req.params.id,
                },
            });
            return res.json({
                msg: `Exclusão de item de ID ${req.params.id} feita com sucesso!`,
            });
        } catch (err) {
            return console.err("Erro na exclusão: ", err);
        }
    },
};
