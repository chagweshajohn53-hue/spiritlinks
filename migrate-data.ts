import { db } from './services/database.js';
import { mockDb } from './services/mockDb.js';

async function migrateData() {
  try {
    console.log('Starting data migration...');
    
    // Migrate links
    const existingLinks = await db.getLinks();
    if (existingLinks.length === 0) {
      const mockLinks = mockDb.getLinks();
      console.log(`Migrating ${mockLinks.length} links...`);
      for (const link of mockLinks) {
        await db.addLink({
          name: link.name,
          description: link.description,
          iconUrl: link.iconUrl,
          redirectUrl: link.redirectUrl
        });
      }
      console.log('Links migration completed!');
    } else {
      console.log('Links already exist in database, skipping migration.');
    }

    // Migrate events
    const existingEvents = await db.getEvents();
    if (existingEvents.length === 0) {
      const mockEvents = mockDb.getEvents();
      console.log(`Migrating ${mockEvents.length} events...`);
      for (const event of mockEvents) {
        await db.addEvent({
          title: event.title,
          description: event.description,
          bannerUrl: event.bannerUrl,
          date: event.date,
          time: event.time,
          deadlineDate: event.deadlineDate
        });
      }
      console.log('Events migration completed!');
    } else {
      console.log('Events already exist in database, skipping migration.');
    }

    // Migrate settings
    const existingSettings = await db.getSettings();
    const mockSettings = mockDb.getSettings();
    if (existingSettings.year === 2026 && existingSettings.theme === 'Year of the Spirit') {
      await db.saveSettings(mockSettings);
      console.log('Settings migration completed!');
    } else {
      console.log('Settings already exist in database, skipping migration.');
    }

    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Data migration failed:', error);
  }
}

migrateData();