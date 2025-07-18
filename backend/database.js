const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    "postgresql://bacon_pancake_postgres_user:6HiY3Q02uPoJbw8H0ftcYNkFsNGckgCK@dpg-d1sl33fgi27c739htue0-a.frankfurt-postgres.render.com/bacon_pancake_postgres",
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Accept self-signed certs (Render often uses this)
      },
    },
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
  reconciledOnSameDay: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = { sequelize, Fight };
