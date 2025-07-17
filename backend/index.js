const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "love_statistics",
  password: "password",
  port: 6543,
});

// Initialize database table
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fights (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample data if table is empty
    const result = await pool.query("SELECT COUNT(*) FROM fights");
    if (parseInt(result.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO fights (timestamp) 
        VALUES ('2024-01-15T10:30:00Z')
      `);
    }

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
}

// GET /fights - Get all fight entries
app.get("/fights", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, timestamp, created_at 
      FROM fights 
      ORDER BY timestamp DESC
    `);

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching fights:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve fights",
    });
  }
});

// POST /fights - Create a new fight entry
app.post("/fights", async (req, res) => {
  try {
    const { timestamp } = req.body;

    // Validation
    if (!timestamp) {
      return res.status(400).json({
        success: false,
        error: "Timestamp is required",
      });
    }

    // Validate timestamp format
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid timestamp format",
      });
    }

    // Insert new fight entry
    const result = await pool.query(
      `
      INSERT INTO fights (timestamp) 
      VALUES ($1) 
      RETURNING id, timestamp, created_at
    `,
      [date.toISOString()]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: "Fight entry created successfully",
    });
  } catch (error) {
    console.error("Error creating fight:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create fight entry",
    });
  }
});

// GET /fights/latest - Get the most recent fight
app.get("/fights/latest", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, timestamp, created_at 
      FROM fights 
      ORDER BY timestamp DESC 
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: "No fights recorded",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching latest fight:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve latest fight",
    });
  }
});

// DELETE /fights/:id - Delete a fight entry
app.delete("/fights/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM fights 
      WHERE id = $1 
      RETURNING id, timestamp, created_at
    `,
      [parseInt(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Fight not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: "Fight entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting fight:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete fight entry",
    });
  }
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      success: true,
      message: "Server and database are running",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      timestamp: new Date().toISOString(),
    });
  }
});

// Start server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Fights API available at http://localhost:${PORT}/fights`);
    console.log(`🐘 PostgreSQL database connected`);
  });
}

startServer().catch(console.error);
