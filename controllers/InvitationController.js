const sequelize = require("../models").sequelize;
const Sequelize = require("../models").Sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);
module.exports = {
    async list(req, res) {
        const Op = Sequelize.Op;
        let raceId = req.query.race_id;
        let statuses = [];
        statuses = req.query.statuses;
        var options = {
            where: {
                user_id: req.user.id,
                status: {
                    [Op.ne]: 4,
                },
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
        };
        if (raceId) {
            options.where.race_id = raceId;
            // options.where.race_id[Op.eq].push(raceId);
        }
        if (statuses) {
            options.where.status[Op.or] = [];
            statuses.forEach((status) => {
                options.where.status[Op.or].push(status);
            });
        }

        try {
            const invitations = await models.invitations.findAll(options);
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

            const user = await models.users.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (!user)
                return res.status(404).json({
                    msg: "User not found",
                });

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

            const previousRace = await models.races.findOne({
                where: {
                    "$drivers.id$": user.id,
                    id: race.id,
                },
                include: [
                    {
                        model: models.users,
                        as: "drivers",
                    },
                ],
            });

            if (previousRace) return res.status(200).json();

            let previousInvitation = await models.invitations.findOne({
                where: {
                    race_id: race.id,
                    user_id: user.id,
                    status: {
                        [Op.eq]: 1,
                    },
                },
            });

            if (previousInvitation) return res.status(200).json();

            const invitation = await models.invitations.create({
                race_id: race.id,
                user_id: user.id,
                status: 1,
            });

            return res.status(200).json();
        } catch (error) {
            //todo global error handling
            console.error("Erro na criação", error);
            return res.status(422).json({
                error: "Campos Inválidos",
            });
        }
    },

    async accept(req, res) {
        const Sequelize = require("sequelize");
        const Op = Sequelize.Op;

        const id = req.params.id;
        try {
            let invitation = await models.invitations.findOne({
                where: {
                    user_id: req.user.id,
                    status: 1,
                    id: id,
                },
            });

            if (!invitation)
                return res.status(404).json({
                    msg: "Invitation not found",
                });

            invitation.status = 2;

            await invitation.save();

            const updated = await models.invitations.findByPk(id);

            return res.json(updated);
        } catch (error) {
            console.log(err);
            return res.status(500).json({
                msg: "Server error",
            });
        }
    },
    async reject(req, res) {
        const Sequelize = require("sequelize");
        const Op = Sequelize.Op;

        const id = req.params.id;
        try {
            let invitation = await models.invitations.findOne({
                where: {
                    user_id: req.user.id,
                    status: 1,
                    id: id,
                },
            });

            if (!invitation)
                return res.status(404).json({
                    msg: "Invitation not found",
                });

            invitation.status = 4;

            await invitation.save();

            const updated = await models.invitations.findByPk(id);

            return res.json(updated);
        } catch (error) {
            console.log(err);
            return res.status(500).json({
                msg: "Server error",
            });
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
