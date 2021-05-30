const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "races",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            circuit_url: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            circuit_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "circuits",
                    key: "id",
                },
            },
            leader_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            raced_at: {
                type: DataTypes.DATE,
                allowNull: true,
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
            tableName: "races",
            timestamps: false,
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
                {
                    name: "fk_race_circuits1_idx",
                    using: "BTREE",
                    fields: [{ name: "circuit_id" }],
                },
                {
                    name: "fk_races_users1_idx",
                    using: "BTREE",
                    fields: [{ name: "leader_id" }],
                },
            ],
        }
    );
};
