'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Product.init({
    movieTitle: DataTypes.STRING,
    releaseYear: DataTypes.INTEGER,
    lenght: DataTypes.STRING,
    director: DataTypes.STRING,
    plot: DataTypes.TEXT,
    Cast: DataTypes.TEXT,
    IMBD_rating: DataTypes.DOUBLE,
    language: DataTypes.STRING,
    genre: DataTypes.STRING,
    MRP: DataTypes.DOUBLE,
    Inventory: DataTypes.INTEGER,
    SellingPrice: DataTypes.DOUBLE,
    ShippingFee: DataTypes.DOUBLE,
    Is_sellabe: DataTypes.INTEGER,
    Sold_unit_count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};