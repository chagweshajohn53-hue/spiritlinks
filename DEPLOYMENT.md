# Spirit Links - Database Integration

## Deployment Instructions

### 1. GitHub Setup
The code is already pushed to: https://github.com/chagweshajohn53-hue/spiritlinks.git

### 2. Netlify Environment Variables
Add these to your Netlify site settings:
- `DATABASE_URL` = your Neon PostgreSQL connection string

### 3. Database Initialization
After deploying, initialize the database by visiting:
`YOUR_SITE_URL/.netlify/functions/init-db` (POST request)

### 4. How It Works
- **Local Development**: Uses localStorage (mockDb)
- **Production**: Uses PostgreSQL database via Netlify Functions
- **Automatic Fallback**: If API fails, falls back to localStorage

### 5. API Endpoints
- `/.netlify/functions/links` - GET, POST, DELETE links
- `/.netlify/functions/events` - GET, POST, PUT, DELETE events

### 6. Data Service
The `dataService` automatically handles switching between API and localStorage:
```typescript
import { dataService } from './services/dataService';

// Usage is the same as before
const links = await dataService.getLinks();
await dataService.addLink(newLink);
```

## Troubleshooting

If you see localStorage data instead of database data:
1. Check that `DATABASE_URL` is set in Netlify
2. Verify the database tables exist
3. Check browser console for API errors

The data will now sync across all devices since it's stored in the PostgreSQL database.