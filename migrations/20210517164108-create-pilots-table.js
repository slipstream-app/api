"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.createTable("pilots", {
            name: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: true,
            },
            uuid: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            race_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "races",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            kart_number: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
                onDelete: "SET NULL",
            },
            position: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            best_lap: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            best_lap_number: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            leader_distance: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            previous_distance: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            last_lap: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            number_of_laps: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: true,
            },
            avg_speed: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: true,
            },
            total_time: {
                type: Sequelize.DataTypes.INTEGER,
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
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                ),
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
        return queryInterface.dropTable("pilots");
    },
};
