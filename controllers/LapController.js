const sequelize = require("../models").sequelize;
const Sequelize = require("../models").Sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);
const readPdf = require("../helpers/readPdf");
module.exports = {
    async list(req, res) {
        try {
            const laps = await models.laps.findAll({
                include: {
                    model: models.pilots,
                    as: 'pilots',
                    where: {
                        user_id: req.user.id
                    }
                }
            });
            return res.json(laps);
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                msg: "Server error"
            });
        }
    },
    async show(req, res) {
        try {
            const user = await models.races.findByPk(req.params.id);
            return res.json(
                user
            );
        } catch (err) {
            return console.err("Erro na busca: ", err);
        }
    },
    async create(req, res) {
        try {
            const race = await models.races.findOne({
                where: {
                    id: req.body.race_id,
                    leader_id: req.user.id
                }
            });

            if (!race) return res.status(404).json({
                msg: 'Corrida não encontrada'
            });

            const pilot = await models.pilots.findOne({
                where: {
                    uuid: req.body.pilot_uuid
                }
            })

            if (!pilot) return res.status(404).json({
                msg: 'Piloto não encontrada'
            });

            const payload = {
                time: req.body.time,
                race_id: req.body.race_id,
                pilot_uuid: req.body.pilot_uuid,
                best_lap_distance: req.body.best_lap_distance,
                best_leader_lap_distance: req.body.best_leader_lap_distance,
                total_time: req.body.total_time,
                avg_speed: req.body.avg_speed,

            };
            const lap = await models.laps.create(payload);
            return res.status(201).json(lap);
        } catch (error) {
            //todo global error handling
            console.error('Erro na criação', error);
            return res.status(422).json({
                error: error.message
            });
        }
    },

    async createFromPdf(req, res) {
        try {
            const Op = Sequelize.Op
            const race = await models.races.findOne({
                where: {
                    id: req.body.race_id,
                    leader_id: req.user.id
                }
            });

            if (!race) return res.status(404).json({
                msg: 'Race not found'
            });


            const pilot = await models.pilots.findOne({
                where: {
                    uuid: req.body.pilot_uuid
                }
            })

            if (!pilot) return res.status(404).json({
                msg: 'Pilot not found'
            });


            let lapsData = await readPdf.readLapPdf();


            lapsData.laps.forEach(element => {
                element.pilot_uuid = pilot.uuid
                element.race_id = race.id
            });




            let laps = await models.laps.bulkCreate(lapsData.laps);
            return res.json(laps)

        } catch (err) {
            console.log(err.message)

            return res.json(err)
        }
    },
    async update(req, res) {
        const Sequelize = require('sequelize');
        const Op = Sequelize.Op
        const {
            title,
            poster,
            overview
        } = req.body;
        const id = req.params.id;
        try {
            await models.races.update({
                title,
                poster,
                overview
            }, {
                where: {
                    id: {
                        [Op.eq]: id
                    }
                }
            });
            return res.json({
                msg: `Filme ${title} atualizado com sucesso!`
            });
        } catch (error) {
            return res.json({
                msg: `Filme ${title} não foi atualizado`
            }, err);
        }
    },
    async delete(req, res) {
        try {
            await models.races.destroy({
                where: {
                    id: req.params.id
                }
            });
            return res.json({
                msg: `Exclusão de item de ID ${req.params.id} feita com sucesso!`
            });
        } catch (err) {
            return console.err("Erro na exclusão: ", err);
        }
    },
}