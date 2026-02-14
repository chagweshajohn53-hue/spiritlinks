import { initializeDatabase } from './services/database.js';

// Initialize database when the application starts
async function init() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Don't exit the process, let the app continue with mock data if needed
  }
}

init();