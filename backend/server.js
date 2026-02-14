const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // use this instead of bodyParser.json()

const corsOptions = {
  origin: [
    'https://grc-filter-task-kapil-frontend.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Apply CORS
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options(/.*/, cors(corsOptions));


// Initialize SQLite database
const dbPath = path.join(__dirname, 'risks.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Seed default risks (runs only if table is empty)
function seedDefaultRisks() {
  const checkSQL = `SELECT COUNT(*) as count FROM risks`;

  db.get(checkSQL, (err, row) => {
    if (err) {
      console.error('Error checking existing risks:', err);
      return;
    }

    // Prevent duplicate seeding
    if (row.count > 0) {
      console.log('Default risks already exist. Skipping seed.');
      return;
    }

    console.log('Seeding default risks...');

    const defaultRisks = [
      { asset: 'Customer Database', threat: 'Unauthorized Access', likelihood: 5, impact: 5 },
      { asset: 'Web Application', threat: 'SQL Injection', likelihood: 4, impact: 5 },
      { asset: 'Cloud Storage', threat: 'Misconfiguration', likelihood: 3, impact: 4 },
      { asset: 'Internal Network', threat: 'Ransomware', likelihood: 4, impact: 4 },
      { asset: 'Backup Server', threat: 'Backup Failure', likelihood: 2, impact: 4 },
      { asset: 'Email System', threat: 'Phishing Attack', likelihood: 5, impact: 3 },
      { asset: 'HR System', threat: 'Insider Data Leak', likelihood: 2, impact: 5 },
      { asset: 'API Gateway', threat: 'DDoS Attack', likelihood: 3, impact: 4 }
    ];

    const insertSQL = `
      INSERT INTO risks (asset, threat, likelihood, impact, score, level)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const stmt = db.prepare(insertSQL);

    defaultRisks.forEach(risk => {
      const score = risk.likelihood * risk.impact;
      const level = calculateRiskLevel(score);

      stmt.run(
        risk.asset,
        risk.threat,
        risk.likelihood,
        risk.impact,
        score,
        level
      );
    });

    stmt.finalize();
    console.log('Default risks inserted successfully.');
  });
}


// Initialize database schema
function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS risks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset TEXT NOT NULL,
      threat TEXT NOT NULL,
      likelihood INTEGER NOT NULL,
      impact INTEGER NOT NULL,
      score INTEGER NOT NULL,
      level TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Risks table initialized');
      seedDefaultRisks();
    }
  });
}

// Helper function to calculate risk score and level
function calculateRiskLevel(score) {
  if (score >= 1 && score <= 5) return 'Low';
  if (score >= 6 && score <= 12) return 'Medium';
  if (score >= 13 && score <= 18) return 'High';
  if (score >= 19 && score <= 25) return 'Critical';
  return 'Unknown';
}

// Helper function to get mitigation hint
function getMitigationHint(level) {
  const hints = {
    'Low': 'Accept / monitor',
    'Medium': 'Plan mitigation within 6 months',
    'High': 'Prioritize action + compensating controls (NIST PR.AC)',
    'Critical': 'Immediate mitigation required + executive reporting'
  };
  return hints[level] || '';
}

// API Endpoints

/**
 * POST /assess-risk
 * Input: { asset, threat, likelihood, impact }
 * Validates, calculates score and level, stores in DB
 */
app.post('/assess-risk', (req, res) => {
  const { asset, threat, likelihood, impact } = req.body;

  // Validation
  if (!asset || !threat) {
    return res.status(400).json({ error: 'Asset and threat are required' });
  }

  if (!Number.isInteger(likelihood) || !Number.isInteger(impact)) {
    return res.status(400).json({ 
      error: 'Invalid range: Likelihood and Impact must be integers between 1-5.' 
    });
  }

  if (likelihood < 1 || likelihood > 5 || impact < 1 || impact > 5) {
    return res.status(400).json({ 
      error: 'Invalid range: Likelihood and Impact must be 1–5.' 
    });
  }

  // Calculate score and level
  const score = likelihood * impact;
  const level = calculateRiskLevel(score);

  // Insert into database
  const insertSQL = `
    INSERT INTO risks (asset, threat, likelihood, impact, score, level)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(insertSQL, [asset, threat, likelihood, impact, score, level], function(err) {
    if (err) {
      console.error('Error inserting risk:', err);
      return res.status(500).json({ error: 'Failed to insert risk' });
    }

    // Return the created risk object
    res.status(201).json({
      id: this.lastID,
      asset,
      threat,
      likelihood,
      impact,
      score,
      level,
      mitigation_hint: getMitigationHint(level)
    });
  });
});

/**
 * GET /risks
 * Returns all risks from database
 * Optional query param: ?level=High (filters by level)
 */
app.get('/risks', (req, res) => {
  const { level } = req.query;

  let selectSQL = 'SELECT * FROM risks ORDER BY score DESC, created_at DESC';
  const params = [];

  if (level) {
    selectSQL = 'SELECT * FROM risks WHERE level = ? ORDER BY score DESC, created_at DESC';
    params.push(level);
  }

  db.all(selectSQL, params, (err, rows) => {
    if (err) {
      console.error('Error fetching risks:', err);
      return res.status(500).json({ error: 'Failed to fetch risks' });
    }

    // Add mitigation hints to each risk
    const enrichedRows = (rows || []).map(row => ({
      ...row,
      mitigation_hint: getMitigationHint(row.level)
    }));

    res.json(enrichedRows);
  });
});

/**
 * GET /risks/:id
 * Returns a specific risk by ID
 */
app.get('/risks/:id', (req, res) => {
  const { id } = req.params;

  const selectSQL = 'SELECT * FROM risks WHERE id = ?';

  db.get(selectSQL, [id], (err, row) => {
    if (err) {
      console.error('Error fetching risk:', err);
      return res.status(500).json({ error: 'Failed to fetch risk' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Risk not found' });
    }

    res.json({
      ...row,
      mitigation_hint: getMitigationHint(row.level)
    });
  });
});

/**
 * DELETE /risks/:id
 * Deletes a specific risk
 */
app.delete('/risks/:id', (req, res) => {
  const { id } = req.params;

  const deleteSQL = 'DELETE FROM risks WHERE id = ?';

  db.run(deleteSQL, [id], function(err) {
    if (err) {
      console.error('Error deleting risk:', err);
      return res.status(500).json({ error: 'Failed to delete risk' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Risk not found' });
    }

    res.json({ message: 'Risk deleted successfully' });
  });
});

/**
 * GET /stats
 * Returns summary statistics
 */
app.get('/stats', (req, res) => {
  const statsSQL = `
    SELECT
      COUNT(*) as total_risks,
      SUM(CASE WHEN level IN ('High', 'Critical') THEN 1 ELSE 0 END) as high_critical_count,
      ROUND(AVG(score), 2) as average_score,
      MAX(score) as max_score,
      MIN(score) as min_score
    FROM risks
  `;

  db.get(statsSQL, (err, row) => {
    if (err) {
      console.error('Error fetching stats:', err);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    res.json(row || {
      total_risks: 0,
      high_critical_count: 0,
      average_score: 0,
      max_score: 0,
      min_score: 0
    });
  });
});

/**
 * GET /heatmap
 * Returns heatmap data (likelihood x impact matrix)
 */
app.get('/heatmap', (req, res) => {
  const heatmapSQL = `
    SELECT 
      likelihood, 
      impact, 
      COUNT(*) as count,
      GROUP_CONCAT(asset, ', ') as assets,
      level
    FROM risks
    GROUP BY likelihood, impact
    ORDER BY likelihood, impact
  `;

  db.all(heatmapSQL, (err, rows) => {
    if (err) {
      console.error('Error fetching heatmap data:', err);
      return res.status(500).json({ error: 'Failed to fetch heatmap data' });
    }

    // Format data as a 5x5 grid
    const heatmapData = {};
    (rows || []).forEach(row => {
      const key = `${row.likelihood}-${row.impact}`;
      heatmapData[key] = {
        count: row.count,
        assets: row.assets ? row.assets.split(', ') : [],
        level: row.level
      };
    });

    res.json(heatmapData);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Database location: ${dbPath}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
