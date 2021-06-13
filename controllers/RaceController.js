const sequelize = require("../models").sequelize;
const Sequelize = require("../models").Sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);
const readPdf = require("../helpers/readPdf");
const pilotsServices = require("../services/pilotServices");
module.exports = {
    async list(req, res) {
        try {
            const Op = Sequelize.Op;
            const races = await models.races.findAll({
                where: {
                    [Op.or]: [
                        {
                            leader_id: req.user.id,
                        },
                        {
                            "$drivers.id$": req.user.id,
                        },
                        {
                            [Op.and]: [
                                {
                                    "$invitations.user_id$": req.user.id,
                                },
                                {
                                    "$invitations.status$": 2,
                                },
                            ],
                        },
                    ],
                },
                include: [
                    {
                        model: models.users,
                        as: "drivers",
                    },
                    {
                        model: models.invitations,
                        as: "invitations",
                    },
                ],
            });

            return res.json(races);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: "Server error",
            });
        }
    },
    async listMyRaces(req, res) {
        try {
            const races = await models.races.findAll({
                where: {
                    leader_id: req.user.id,
                },
                /*   include: {
                      model: models.users,
                      where: {
                          id: req.user.id
                      }
                  } */
            });
            return res.json(races);
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: "Server error",
            });
        }
    },
    async show(req, res) {
        try {
            const race = await models.races.findByPk(req.params.id);
            return res.json(race);
        } catch (err) {
            return console.err("Erro na busca: ", err);
        }
    },
    async create(req, res) {
        const payload = {
            name: req.body.name,
            circuit_url: req.body.circuit_url,
            raced_at: req.body.raced_at,
            leader_id: req.user.id,
        };

        try {
            const race = await models.races.create(payload);
            return res.status(201).json(race);
        } catch (error) {
            //todo global error handling
            console.error("Erro na criação", error);
            return res.status(422).json({
                error: "Campos Inválidos",
            });
        }
    },
    async createFromPdf(req, res) {
        try {
            if (!req.files) {
                return res.status(422).json({
                    error: "Campos Inválidos",
                });
            } else {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file

                const payload = {
                    name: req.body.name,
                    circuit_url: req.body.circuit_url,
                    raced_at: req.body.raced_at,
                    leader_id: req.user.id,
                };

                const race = await models.races.create(payload);

                let pdf = req.files.pdf;
                let pilotsData = await readPdf.readRacePdf(pdf);

                let pilotsPayload = pilotsData.map((pilotData) => {
                    let pilot = pilotData;
                    pilot.race_id = race.id;
                    return pilot;
                });

                pilotsPayload.forEach((payload) => {
                    pilotsServices.createPilot(payload, req);
                });

                const invitation = await models.invitations.create({
                    race_id: race.id,
                    user_id: req.user.id,
                    status: 2,
                });
                return res.json({
                    race: race,
                });
            }
        } catch (err) {
            res.status(500).json(err);
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
