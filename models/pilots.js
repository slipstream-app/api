const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "pilots",
        {
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            uuid: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
                validate: {
                    isUUID: 4,
                },
            },
            race_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "races",
                    key: "id",
                },
            },
            kart_number: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: "Kart number must be an integer",
                    },
                    min: {
                        args: [1],
                        msg: "Kart number must be greater than 0",
                    },
                },
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
                validate: {
                    isInt: {
                        msg: "User Id must be an integer",
                    },
                },
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: "Position must be an integer",
                    },
                    min: {
                        args: [1],
                        msg: "Position must be greater than 0",
                    },
                },
            },
            best_lap: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: "Best lap must be an integer",
                    },
                    min: {
                        args: [1],
                        msg: "Best lap  must be greater than 0 ms",
                    },
                },
            },
            best_lap_number: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: "Best lap number must be an integer",
                    },
                    min: {
                        args: [1],
                        msg: "Best lap number must be greater than 0",
                    },
                },
            },
            leader_distance: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: "Leader distance must be an integer",
                    },
                },
            },
            previous_distance: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: "Previous distance must be an integer",
                    },
                },
            },
            last_lap: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: "Last lap must be an integer",
                    },
                    min: {
                        args: [1],
                        msg: "Last lap  must be greater than 0 ms",
                    },
                },
            },
            number_of_laps: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: "Number of laps must be an integer",
                    },
                    min: {
                        args: [1],
                        msg: "Number of laps must be greater than 0 ms",
                    },
                },
            },
            avg_speed: {
                type: DataTypes.FLOAT,
                allowNull: true,
                validate: {
                    isFloat: {
                        msg: "Average speed must be a float",
                    },
                    min: {
                        args: [1],
                        msg: "Average speed must be greater than 0 ms",
                    },
                },
            },
            total_time: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: "Best lap must be an integer",
                    },
                    min: {
                        args: [1],
                        msg: "Best lap  must be greater than 0 ms",
                    },
                },
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "pilots",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        {
                            name: "uuid",
                        },
                    ],
                },
                {
                    name: "fk_pilots_users1_idx",
                    using: "BTREE",
                    fields: [
                        {
                            name: "user_id",
                        },
                    ],
                },
                {
                    name: "fk_pilot_race1",
                    using: "BTREE",
                    fields: [
                        {
                            name: "race_id",
                        },
                    ],
                },
            ],
        }
    );
};
