//const user = require('../models/users');
//const models = require("../models");
const sequelize = require("../models").sequelize;
var initModels = require("../models/init-models");
var models = initModels(sequelize);
const saltRounds = 10;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//const verifyJwt = require('../helpers/verifyJwt');
module.exports = {
    async login(req, res) {
        try {
            const user = await models.users.findOne({
                where: {
                    email: req.body.email,
                },
            });

            if (!user) {
                return res.status(422).json({
                    msg: "Email ou senha incorretos",
                });
            }
            const result = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (result) {
                const payload = {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    nickname: user.nickname,
                };
                var token = jwt.sign(payload, process.env.KEY, {
                    expiresIn: 86400,
                });

                var refreshToken = jwt.sign(payload, process.env.REFRESH_KEY, {
                    expiresIn: 604800,
                });
                return res.json({
                    access_token: token,
                    refresh_token: refreshToken,
                });
            } else {
                return res.status(422).json({
                    msg: "Email ou senha incorretos",
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(500);
        }
    },
    async refreshToken(req, res) {
        try {
            jwt.verify(
                req.body.refresh_token,
                process.env.REFRESH_KEY,
                (err, authData) => {
                    if (err) {
                        console.log(err);
                        res.status(422).send({
                            msg: "Token Inválido",
                        });
                        //   res.send(new errs.NotAuthorizedError("Token Inválido"));
                    } else {
                        let payload = {
                            id: authData.id,
                            first_name: authData.first_name,
                            last_name: authData.last_name,
                            email: authData.email,
                            nickname: authData.nickname,
                        };
                        token = jwt.sign(payload, process.env.KEY, {
                            expiresIn: 86400,
                        });

                        req.user = authData;
                        return res.json({
                            access_token: token,
                        });
                    }
                }
            );
        } catch (err) {
            console.error("Erro na listagem: ", err);
            return res.status(500).json({
                msg: "Erro interno",
            });
        }
    },
    async list(req, res) {
        try {
            const users = await models.users.findAll();
            return res.json(users);
        } catch (err) {
            return console.error("Erro na listagem: ", err);
        }
    },
    async show(req, res) {
        try {
            const user = await models.users.findByPk(req.params.id);

            return res.json(user);
        } catch (err) {
            return console.err("Erro na busca: ", err);
        }
    },
    async me(req, res) {
        try {
            const user = await models.users.findByPk(req.user.id);
            if (!user)
                return res.status(404).json({
                    msg: "User not found",
                });
            return res.json(user);
        } catch (err) {
            return console.err("Erro na busca: ", err);
        }
    },
    async meUpdate(req, res) {
        try {
            var user = await models.users.findByPk(req.user.id);
            if (!user)
                return res.status(404).json({
                    msg: "User not found",
                });
            const { first_name, last_name } = req.body;

            user.first_name = first_name;
            user.last_name = last_name;

            user.save();
            return res.json(user);
        } catch (err) {
            return console.err("Erro na busca: ", err);
        }
    },
    async create(req, res) {
        var payload = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            nickname: req.body.nickname,
        };

        payload.password = await bcrypt.hash(req.body.password, saltRounds);

        try {
            var user = await models.users.findOne({
                where: {
                    email: req.body.email,
                },
            });
            if (!user) {
                user = await models.users.create(payload);
                return res.status(201).json(user);
            } else {
                return res.status(422).json({
                    msg: "Um usuário com esse email já existe",
                });
            }
        } catch (error) {
            console.error(error);
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
            await models.users.update(
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
            await models.users.destroy({
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
