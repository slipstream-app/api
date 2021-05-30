"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.createTable("comments", {
            id: {
                autoIncrement: true,
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            comment: {
                type: Sequelize.DataTypes.TEXT,
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
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            race_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "races",
                    key: "id",
                },
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
        return queryInterface.dropTable("comments");
    },
};
