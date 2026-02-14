import React, { useState, useEffect } from 'react';
import { db } from '../services/database';

const DatabaseTest: React.FC = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testDatabase = async () => {
      try {
        console.log('Testing database connection...');
        const fetchedLinks = await db.getLinks();
        console.log('Database connection successful!', fetchedLinks);
        setLinks(fetchedLinks);
        setLoading(false);
      } catch (err) {
        console.error('Database connection failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    testDatabase();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Testing database connection...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <h3 className="font-bold">Database Connection Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">Database Connection Successful!</h3>
      <p>Found {links.length} links in the database.</p>
      {links.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">Links:</h4>
          <ul className="list-disc pl-5">
            {links.map(link => (
              <li key={link.id}>{link.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DatabaseTest;