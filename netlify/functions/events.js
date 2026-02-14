const { builder } = require('@netlify/functions');
const { Pool } = require('pg');

console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL value:', process.env.DATABASE_URL ? 'set' : 'not set');

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
      // Get all events
      const result = await pool.query(
        'SELECT id, title, description, banner_url, event_date, event_time, deadline_date, status, attendees, created_at FROM events ORDER BY event_date DESC, event_time DESC'
      );
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(result.rows.map(row => {
          const eventDate = new Date(row.event_date);
          const deadlineDate = row.deadline_date ? new Date(row.deadline_date) : null;
          
          let autoStatus = row.status;
          if (eventDate < now || (deadlineDate && deadlineDate < now)) {
            autoStatus = 'past';
          }

          return {
            id: row.id,
            title: row.title,
            description: row.description,
            bannerUrl: row.banner_url,
            date: row.event_date,
            time: row.event_time,
            deadlineDate: row.deadline_date || undefined,
            status: autoStatus,
            attendees: parseInt(row.attendees) || 0,
            createdAt: parseInt(row.created_at)
          };
        }))
      };
    }

    if (event.httpMethod === 'POST') {
      // Add new event
      const { title, description, bannerUrl, date, time, deadlineDate } = JSON.parse(event.body);
      const id = Math.random().toString(36).substr(2, 9);
      const createdAt = Date.now().toString();
      
      await pool.query(
        'INSERT INTO events (id, title, description, banner_url, event_date, event_time, deadline_date, status, attendees, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [id, title, description, bannerUrl, date, time, deadlineDate || null, 'active', 0, createdAt]
      );
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          id, title, description, bannerUrl, date, time, deadlineDate, 
          status: 'active', attendees: 0, createdAt 
        })
      };
    }

    if (event.httpMethod === 'PUT') {
      // Update event
      const { id, ...updates } = JSON.parse(event.body);
      const fields = [];
      const values = [];
      let paramIndex = 1;

      Object.keys(updates).forEach(key => {
        if (key === 'title') {
          fields.push(`title = $${paramIndex++}`);
          values.push(updates[key]);
        } else if (key === 'description') {
          fields.push(`description = $${paramIndex++}`);
          values.push(updates[key]);
        } else if (key === 'bannerUrl') {
          fields.push(`banner_url = $${paramIndex++}`);
          values.push(updates[key]);
        } else if (key === 'date') {
          fields.push(`event_date = $${paramIndex++}`);
          values.push(updates[key]);
        } else if (key === 'time') {
          fields.push(`event_time = $${paramIndex++}`);
          values.push(updates[key]);
        } else if (key === 'deadlineDate') {
          fields.push(`deadline_date = $${paramIndex++}`);
          values.push(updates[key]);
        } else if (key === 'status') {
          fields.push(`status = $${paramIndex++}`);
          values.push(updates[key]);
        }
      });

      if (fields.length > 0) {
        values.push(id);
        await pool.query(
          `UPDATE events SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
          values
        );
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, id, ...updates })
      };
    }

    if (event.httpMethod === 'DELETE') {
      // Delete event
      const { id } = JSON.parse(event.body);
      await pool.query('DELETE FROM events WHERE id = $1', [id]);
      
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
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message, stack: error.stack })
    };
  }
});