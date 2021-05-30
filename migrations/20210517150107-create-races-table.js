"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.createTable("races", {
            id: {
                autoIncrement: true,
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            name: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true,
            },
            circuit_url: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
            },
            circuit_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "circuits",
                    key: "id",
                },
            },
            leader_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            raced_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updated_at: {
                type: Sequelize.DataTypes.DATE,
                allowNull: true,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return queryInterface.dropTable("races");
    },
};
