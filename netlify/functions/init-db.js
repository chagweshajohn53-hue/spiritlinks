// This script runs in Netlify Functions environment to initialize database tables
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  try {
    // Create links table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS links (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon_url VARCHAR(500),
        redirect_url VARCHAR(500),
        created_at BIGINT NOT NULL
      )
    `);

    // Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        banner_url VARCHAR(500),
        event_date DATE NOT NULL,
        event_time TIME NOT NULL,
        deadline_date DATE,
        status VARCHAR(20) NOT NULL,
        attendees INTEGER DEFAULT 0,
        created_at BIGINT NOT NULL
      )
    `);

    // Create settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        theme VARCHAR(255) NOT NULL
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await pool.end();
  }
}

// Run initialization when the function is called
exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST' && event.path === '/init-db') {
    await initializeDatabase();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Database initialized' })
    };
  }
  
  return {
    statusCode: 404,
    body: JSON.stringify({ error: 'Not found' })
  };
};