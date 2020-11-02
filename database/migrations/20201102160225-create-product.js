'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      movieTitle: {
        type: Sequelize.STRING
      },
      releaseYear: {
        type: Sequelize.INTEGER
      },
      lenght: {
        type: Sequelize.STRING
      },
      director: {
        type: Sequelize.STRING
      },
      plot: {
        type: Sequelize.TEXT
      },
      Cast: {
        type: Sequelize.TEXT
      },
      IMBD_rating: {
        type: Sequelize.DOUBLE
      },
      language: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.STRING
      },
      MRP: {
        type: Sequelize.DOUBLE
      },
      Inventory: {
        type: Sequelize.INTEGER
      },
      SellingPrice: {
        type: Sequelize.DOUBLE
      },
      ShippingFee: {
        type: Sequelize.DOUBLE
      },
      Is_sellabe: {
        type: Sequelize.INTEGER
      },
      Sold_unit_count: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};