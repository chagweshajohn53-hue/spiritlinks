
import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockDb';
import { LinkItem } from '../types';
import { ExternalLink, Search } from 'lucide-react';

const Links: React.FC = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLinks(mockDb.getLinks());
  }, []);

  const filteredLinks = links.filter(link => 
    link.name.toLowerCase().includes(search.toLowerCase()) || 
    link.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 bg-[#000B18]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
        <div>
          <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Ecosystem Directory</span>
          <h2 className="text-6xl font-black tracking-tighter text-white mb-4">Links</h2>
          <p className="text-slate-500 text-lg max-w-lg">One portal, limitless spiritual connection. Navigate the Spirit Embassy digital world.</p>
        </div>
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#C5A059]" size={22} />
          <input 
            type="text" 
            placeholder="Search our network..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-[#001226] border border-[#C5A059]/30 rounded-[1.5rem] text-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none transition-all placeholder:text-slate-600 font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredLinks.map(link => (
          <a 
            key={link.id} 
            href={link.redirectUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-[#001226] rounded-[2.5rem] p-8 border border-[#C5A059]/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[#C5A059]/10 hover:border-[#C5A059]/40 transition-all hover:-translate-y-2 flex flex-col"
          >
            <div className="mb-8 relative self-start">
              <img src={link.iconUrl} alt={link.name} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-2xl group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute -top-3 -right-3 bg-[#C5A059] text-[#000B18] p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                <ExternalLink size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#C5A059] transition-colors">{link.name}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow font-medium">
              {link.description}
            </p>
            <div className="flex items-center text-[#C5A059] font-black text-[10px] uppercase tracking-widest border-t border-[#C5A059]/10 pt-6 group-hover:border-[#C5A059]/30 transition-colors">
              Access Link
              <ExternalLink size={12} className="ml-2" />
            </div>
          </a>
        ))}
        {filteredLinks.length === 0 && (
          <div className="col-span-full py-32 text-center text-slate-600 font-bold italic text-xl tracking-tight">
            No platforms matching your query...
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;