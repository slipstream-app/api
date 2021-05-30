"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable(
                "invitations",
                {
                    id: {
                        autoIncrement: true,
                        type: Sequelize.DataTypes.INTEGER,
                        allowNull: false,
                        primaryKey: true,
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
                    race_id: {
                        type: Sequelize.DataTypes.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        references: {
                            model: "races",
                            key: "id",
                        },
                    },
                    user_id: {
                        type: Sequelize.DataTypes.INTEGER,
                        allowNull: false,
                        primaryKey: true,
                        references: {
                            model: "users",
                            key: "id",
                        },
                    },
                    status: {
                        type: Sequelize.DataTypes.TINYINT,
                        allowNull: true,
                    },
                },
                { transaction }
            );
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return queryInterface.dropTable("invitations");
    },
};
