const sequelize = require("../models").sequelize;
const Sequelize = require("../models").Sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);

module.exports = {
    async createPilot(pilotPayload, req) {
        try {
            const Op = Sequelize.Op

            const race = await models.races.findOne({
                where: {
                    id: pilotPayload.race_id,
                    leader_id: req.user.id
                }
            });

            if (!race) return false;

            const pilot = await models.pilots.findOne({
                where: {
                    race_id: pilotPayload.race_id,
                    [Op.or]: [{
                            kart_number: pilotPayload.kart_number
                        },
                        {
                            position: pilotPayload.position
                        }
                    ]
                }
            })

            if (pilot) return false;

            const newPilot = await models.pilots.create(pilotPayload);
            return newPilot;
        } catch (error) {
            //todo global error handling
            console.error('Erro na criação', error);
            return false;
        }
    }
}