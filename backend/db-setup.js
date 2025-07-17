const { sequelize, Fight } = require("./database");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection established.");

    await sequelize.sync({ alter: true }); // or { force: true } for a full drop + recreate
    console.log("✅ All models were synchronized.");

    // Optionally: insert a test row
    // await Fight.create({ timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
})();
