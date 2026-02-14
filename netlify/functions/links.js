const { builder } = require('@netlify/functions');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

exports.handler = builder(async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    if (event.httpMethod === 'GET') {
      // Get all links
      const result = await pool.query(
        'SELECT id, name, description, icon_url, redirect_url, created_at FROM links ORDER BY created_at DESC'
      );
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.rows.map(row => ({
          id: row.id,
          name: row.name,
          description: row.description,
          iconUrl: row.icon_url,
          redirectUrl: row.redirect_url,
          createdAt: parseInt(row.created_at)
        })))
      };
    }

    if (event.httpMethod === 'POST') {
      // Add new link
      const { name, description, iconUrl, redirectUrl } = JSON.parse(event.body);
      const id = Math.random().toString(36).substr(2, 9);
      const createdAt = Date.now().toString();
      
      await pool.query(
        'INSERT INTO links (id, name, description, icon_url, redirect_url, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, name, description, iconUrl, redirectUrl, createdAt]
      );
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          id, name, description, iconUrl, redirectUrl, createdAt 
        })
      };
    }

    if (event.httpMethod === 'DELETE') {
      // Delete link
      const { id } = JSON.parse(event.body);
      await pool.query('DELETE FROM links WHERE id = $1', [id]);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
});