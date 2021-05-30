"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.createTable("circuits", {
            id: {
                autoIncrement: true,
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            circuit_url: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: true,
            },
            name: {
                type: Sequelize.DataTypes.STRING(255),
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
        return queryInterface.dropTable("circuits");
    },
};
