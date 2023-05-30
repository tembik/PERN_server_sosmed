"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Komentars", "userId", {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id",
        as: "userId",
      },
    });
    await queryInterface.addColumn("Komentars", "postId", {
      allowNull: false,
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Posts",
        key: "id",
        as: "postId",
      },
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Komentars", "userId");
    await queryInterface.removeColumn("Komentars", "postId");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
