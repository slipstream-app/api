"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable("users", {
            id: {
                autoIncrement: true,
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            nickname: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false,
            },
            first_name: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false,
            },
            last_name: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false,
            },
            email: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: Sequelize.DataTypes.STRING(255),
                allowNull: false,
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
        return queryInterface.dropTable("users");
    },
};
