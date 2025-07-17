const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/bacon_pancakes",
  {
    dialect: "postgres",
    logging: false,
  }
);

const Fight = sequelize.define("Fight", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  timestamp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { sequelize, Fight };
