
import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockDb';
// Use LinkItem instead of the non-existent AppItem
import { LinkItem } from '../types';
import { ExternalLink, Search } from 'lucide-react';

const Apps: React.FC = () => {
  // Use LinkItem type
  const [apps, setApps] = useState<LinkItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Use getLinks instead of the non-existent getApps
    setApps(mockDb.getLinks());
  }, []);

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase()) || 
    app.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Applications</h2>
          <p className="text-slate-500 text-lg">Explore our digital ecosystem and stay connected.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredApps.map(app => (
          <a 
            key={app.id} 
            href={app.redirectUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-100/40 hover:shadow-2xl hover:shadow-violet-200/50 transition-all hover:-translate-y-1"
          >
            <div className="mb-6 relative">
              <img src={app.iconUrl} alt={app.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
              <div className="absolute -top-2 -right-2 bg-violet-100 text-violet-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={16} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{app.name}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
              {app.description}
            </p>
            <div className="flex items-center text-violet-600 font-bold text-sm">
              Open App
              <ExternalLink size={14} className="ml-2" />
            </div>
          </a>
        ))}
        {filteredApps.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400">
            No applications found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Apps;
