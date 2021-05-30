"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.createTable("laps", {
            id: {
                autoIncrement: true,
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            time: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
            },
            race_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "races",
                    key: "id",
                },
            },
            pilot_uuid: {
                type: Sequelize.DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "pilots",
                    key: "uuid",
                },
            },
            best_lap_distance: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            best_leader_lap_distance: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            total_time: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            avg_speed: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: true,
            },
            lap_number: {
                type: Sequelize.DataTypes.INTEGER,
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
        return queryInterface.dropTable("laps");
    },
};
