const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "user_race",
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            race_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "races",
                    key: "id",
                },
            },
            is_public: {
                type: DataTypes.TINYINT,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "user_race",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "user_id" }, { name: "race_id" }],
                },
                {
                    name: "fk_users_has_races_races1_idx",
                    using: "BTREE",
                    fields: [{ name: "race_id" }],
                },
                {
                    name: "fk_users_has_races_users_idx",
                    using: "BTREE",
                    fields: [{ name: "user_id" }],
                },
            ],
        }
    );
};
