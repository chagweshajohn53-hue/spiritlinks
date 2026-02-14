import { Pool } from 'pg';
import { LinkItem, ChurchEvent, SystemSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database tables
export async function initializeDatabase() {
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

    // Insert default settings if not exists
    const settingsResult = await pool.query('SELECT COUNT(*) FROM settings');
    if (parseInt(settingsResult.rows[0].count) === 0) {
      await pool.query(
        'INSERT INTO settings (year, theme) VALUES ($1, $2)',
        [DEFAULT_SETTINGS.year, DEFAULT_SETTINGS.theme]
      );
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Database operations
export const db = {
  // Links operations
  async getLinks(): Promise<LinkItem[]> {
    try {
      const result = await pool.query(
        'SELECT id, name, description, icon_url, redirect_url, created_at FROM links ORDER BY created_at DESC'
      );
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        description: row.description,
        iconUrl: row.icon_url,
        redirectUrl: row.redirect_url,
        createdAt: parseInt(row.created_at)
      }));
    } catch (error) {
      console.error('Error fetching links:', error);
      return [];
    }
  },

  async addLink(link: Omit<LinkItem, 'id' | 'createdAt'>): Promise<void> {
    try {
      const id = Math.random().toString(36).substr(2, 9);
      const createdAt = Date.now();
      
      await pool.query(
        'INSERT INTO links (id, name, description, icon_url, redirect_url, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, link.name, link.description, link.iconUrl, link.redirectUrl, createdAt.toString()]
      );
    } catch (error) {
      console.error('Error adding link:', error);
      throw error;
    }
  },

  async updateLink(id: string, updatedLink: Partial<LinkItem>): Promise<void> {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updatedLink.name !== undefined) {
        fields.push(`name = $${paramIndex++}`);
        values.push(updatedLink.name);
      }
      if (updatedLink.description !== undefined) {
        fields.push(`description = $${paramIndex++}`);
        values.push(updatedLink.description);
      }
      if (updatedLink.iconUrl !== undefined) {
        fields.push(`icon_url = $${paramIndex++}`);
        values.push(updatedLink.iconUrl);
      }
      if (updatedLink.redirectUrl !== undefined) {
        fields.push(`redirect_url = $${paramIndex++}`);
        values.push(updatedLink.redirectUrl);
      }

      if (fields.length > 0) {
        values.push(id);
        await pool.query(
          `UPDATE links SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
          values
        );
      }
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  },

  async deleteLink(id: string): Promise<void> {
    try {
      await pool.query('DELETE FROM links WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error deleting link:', error);
      throw error;
    }
  },

  // Events operations
  async getEvents(): Promise<ChurchEvent[]> {
    try {
      const result = await pool.query(
        'SELECT id, title, description, banner_url, event_date, event_time, deadline_date, status, attendees, created_at FROM events ORDER BY event_date DESC, event_time DESC'
      );
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return result.rows.map(row => {
        const eventDate = new Date(row.event_date);
        const deadlineDate = row.deadline_date ? new Date(row.deadline_date) : null;
        
        let autoStatus = row.status as 'active' | 'past';
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
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  async addEvent(event: Omit<ChurchEvent, 'id' | 'createdAt' | 'attendees' | 'status'>): Promise<void> {
    try {
      const id = Math.random().toString(36).substr(2, 9);
      const createdAt = Date.now();
      
      await pool.query(
        'INSERT INTO events (id, title, description, banner_url, event_date, event_time, deadline_date, status, attendees, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
        [id, event.title, event.description, event.bannerUrl, event.date, event.time, event.deadlineDate || null, 'active', 0, createdAt.toString()]
      );
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  },

  async updateEvent(id: string, updatedEvent: Partial<ChurchEvent>): Promise<void> {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (updatedEvent.title !== undefined) {
        fields.push(`title = $${paramIndex++}`);
        values.push(updatedEvent.title);
      }
      if (updatedEvent.description !== undefined) {
        fields.push(`description = $${paramIndex++}`);
        values.push(updatedEvent.description);
      }
      if (updatedEvent.bannerUrl !== undefined) {
        fields.push(`banner_url = $${paramIndex++}`);
        values.push(updatedEvent.bannerUrl);
      }
      if (updatedEvent.date !== undefined) {
        fields.push(`event_date = $${paramIndex++}`);
        values.push(updatedEvent.date);
      }
      if (updatedEvent.time !== undefined) {
        fields.push(`event_time = $${paramIndex++}`);
        values.push(updatedEvent.time);
      }
      if (updatedEvent.deadlineDate !== undefined) {
        fields.push(`deadline_date = $${paramIndex++}`);
        values.push(updatedEvent.deadlineDate);
      }
      if (updatedEvent.status !== undefined) {
        fields.push(`status = $${paramIndex++}`);
        values.push(updatedEvent.status);
      }
      if (updatedEvent.attendees !== undefined) {
        fields.push(`attendees = $${paramIndex++}`);
        values.push(updatedEvent.attendees);
      }

      if (fields.length > 0) {
        values.push(id);
        await pool.query(
          `UPDATE events SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
          values
        );
      }
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  async deleteEvent(id: string): Promise<void> {
    try {
      await pool.query('DELETE FROM events WHERE id = $1', [id]);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  async incrementAttendees(id: string): Promise<void> {
    try {
      await pool.query(
        'UPDATE events SET attendees = attendees + 1 WHERE id = $1',
        [id]
      );
    } catch (error) {
      console.error('Error incrementing attendees:', error);
      throw error;
    }
  },

  // Settings operations
  async getSettings(): Promise<SystemSettings> {
    try {
      const result = await pool.query('SELECT year, theme FROM settings LIMIT 1');
      if (result.rows.length > 0) {
        return {
          year: parseInt(result.rows[0].year),
          theme: result.rows[0].theme
        };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: SystemSettings): Promise<void> {
    try {
      await pool.query(
        'UPDATE settings SET year = $1, theme = $2 WHERE id = 1',
        [settings.year, settings.theme]
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
};

export { pool };