const express = require("express");
const cors = require("cors");
const { sequelize, Fight } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/fights", async (req, res) => {
  try {
    const fights = await Fight.findAll();
    res.json(fights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/fights", async (req, res) => {
  try {
    const fight = await Fight.create(req.body);
    res.status(201).json(fight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
