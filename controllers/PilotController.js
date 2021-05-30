const sequelize = require("../models").sequelize;
const Sequelize = require("../models").Sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);
const readPdf = require("../helpers/readPdf");
const handlePayload = require("../helpers/handlePayloads");
module.exports = {
    async list(req, res) {
        try {
            const race = await models.races.findByPk(req.query.race_id);
            if (!race) {
                return res.status(404).json({
                    msg: "Corrida não encontrada",
                });
            }
            const pilots = await models.pilots.findAll({
                where: {
                    race_id: race.id,
                },
                order: [
                    // Will escape title and validate DESC against a list of valid direction parameters
                    ["position", "ASC"],
                ],
            });
            return res.json({
                data: pilots,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                msg: "Server error",
            });
        }
    },
    async show(req, res) {
        try {
            const user = await models.pilots.findByPk(req.params.id);
            return res.json(user);
        } catch (err) {
            return console.err("Erro na busca: ", err);
        }
    },
    async create(req, res) {
        try {
            const Op = Sequelize.Op;

            const race = await models.races.findOne({
                where: {
                    id: req.body.race_id,
                    leader_id: req.user.id,
                },
            });

            if (!race)
                return res.status(404).json({
                    msg: "Race not found",
                });

            const pilot = await models.pilots.findOne({
                where: {
                    race_id: req.body.race_id,
                    [Op.or]: [
                        {
                            kart_number: req.body.kart_number,
                        },
                        {
                            position: req.body.position,
                        },
                    ],
                },
            });

            if (pilot)
                return res.status(422).json({
                    msg: "There is already a pilot with this position and/or kart number",
                });

            const payload = {
                name: req.body.name,
                race_id: req.body.race_id,
                kart_number: req.body.kart_number,
                position: req.body.best_lap_distance,
                best_lap: req.body.best_lap,
                best_lap_number: req.body.best_lap_number,
                leader_distance: req.body.leader_distance,
                previous_distance: req.body.previous_distance,
                last_lap: req.body.last_lap,
                number_of_laps: req.body.number_of_laps,
                avg_speed: req.body.avg_speed,
            };
            const newPilot = await models.pilots.create(payload);
            return res.status(201).json(newPilot);
        } catch (error) {
            //todo global error handling
            console.error("Erro na criação", error);
            return res.status(422).json({
                error: error.message,
            });
        }
    },
    async createFromPdf(req, res) {
        try {
            const Op = Sequelize.Op;
            const race = await models.races.findOne({
                where: {
                    id: req.body.race_id,
                    leader_id: req.user.id,
                },
            });
            if (!race)
                return res.status(404).json({
                    msg: "Race not found",
                });

            let pilotsData = await readPdf.readRacePdf();

            for (let index = 0; index < pilotsData.length; index++) {
                let pilotData = pilotsData[index];
                var pilot = await models.pilots.findOne({
                    where: {
                        race_id: req.body.race_id,
                        [Op.or]: [
                            {
                                kart_number: pilotData.kart_number,
                            },
                            {
                                position: pilotData.position,
                            },
                        ],
                    },
                });
                if (pilot)
                    return res.status(422).json({
                        msg: "There is already a pilot with this position and/or kart number",
                    });
                pilotsData[index].race_id = race.id;
            }

            let pilots = await models.pilots.bulkCreate(pilotsData);
            return res.json(pilots);
        } catch (error) {
            //to do global error handling
            console.error("Erro na criação", error);
            return res.status(422).json({
                error: error.message,
            });
        }
    },
    async redeem(req, res) {
        const Sequelize = require("sequelize");
        const Op = Sequelize.Op;

        try {
            const uuid = req.params.id;
            let pilot = await models.pilots.findOne({
                where: {
                    uuid: uuid,
                },
            });

            if (!pilot)
                return res.status(404).json({
                    msg: "Pilot not found",
                });

            let invitation = await models.invitations.findOne({
                where: {
                    race_id: pilot.race_id,
                    user_id: req.user.id,
                    status: 1,
                },
            });

            if (!invitation)
                return res.status(404).json({
                    msg: "Invitation not found",
                });

            pilot.user_id = req.user.id;
            await pilot.save();

            invitation.status = 2;
            invitation.save();

            return res.json(pilot);
        } catch (err) {
            return res.status(500).json({
                msg: err.message,
            });
        }
    },
    async update(req, res) {
        const Sequelize = require("sequelize");
        const Op = Sequelize.Op;

        try {
            const uuid = req.params.id;
            const payload = handlePayload.handlePilotPayload(req.body);
            let pilot = await models.pilots.findOne({
                where: {
                    uuid: uuid,
                },
            });

            if (!pilot)
                return res.status(404).json({
                    msg: "Pilot not found",
                });

            let race = await models.races.findByPk(pilot.race_id);

            if (!race)
                return res.status(404).json({
                    msg: "Race not found",
                });

            if (race.leader_id != req.user.id) {
                return res.status(401).json({
                    msg: "Not the race leader",
                });
            }

            await models.pilots.update(payload, {
                where: {
                    uuid: {
                        [Op.eq]: uuid,
                    },
                },
                returning: true,
                plain: true,
            });

            const updated = await models.pilots.findByPk(uuid);

            return res.json(updated);
        } catch (err) {
            return res.status(500).json({
                msg: err.message,
            });
        }
    },
    async delete(req, res) {
        /*  const Sequelize = require("sequelize");
        const Op = Sequelize.Op;
 */
        try {
            const uuid = req.params.id;
            let pilot = await models.pilots.findOne({
                where: {
                    uuid: uuid,
                },
            });

            if (!pilot)
                return res.status(404).json({
                    msg: "Pilot not found",
                });

            let race = await models.races.findByPk(pilot.race_id);

            if (!race)
                return res.status(404).json({
                    msg: "Race not found",
                });

            if (race.leader_id != req.user.id) {
                return res.status(401).json({
                    msg: "Not the race leader",
                });
            }

            await models.pilots.destroy({
                where: {
                    uuid: pilot.uuid,
                },
            });
            return res.json({
                msg: `Exclusão do piloto de ID: ${req.params.id} feita com sucesso!`,
            });
        } catch (err) {
            return console.err("Erro na exclusão: ", err);
        }
    },
};
