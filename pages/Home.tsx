
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import YearBanner from '../components/YearBanner';
import { mockDb } from '../services/mockDb';
import { SystemSettings, LinkItem, ChurchEvent } from '../types';
import { ArrowRight, LayoutGrid, Calendar, ChevronDown } from 'lucide-react';

const Home: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>(mockDb.getSettings());
  const [featuredLinks, setFeaturedLinks] = useState<LinkItem[]>([]);
  const [nextEvent, setNextEvent] = useState<ChurchEvent | null>(null);

  useEffect(() => {
    setFeaturedLinks(mockDb.getLinks().slice(0, 3));
    const events = mockDb.getEvents();
    if (events.length > 0) {
      setNextEvent(events[0]);
    }
  }, []);

  return (
    <div className="animate-in fade-in duration-1000 bg-[#000B18]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <span className="inline-block px-6 py-2 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-10 shadow-[0_0_20px_rgba(197,160,89,0.1)]">
            Official Digital Gateway
          </span>
          <h1 className="text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter leading-none">
            EXPO<span className="text-[#C5A059]">LINK</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto mb-14 leading-relaxed tracking-wide">
            The Digital Heart of Spirit Embassy. Elevating faith through innovation and excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/links" className="w-full sm:w-auto px-12 py-5 bg-[#C5A059] text-[#000B18] font-black text-sm uppercase tracking-widest rounded-2xl shadow-[0_10px_40px_rgba(197,160,89,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3">
              Browse Links <LayoutGrid size={20} />
            </Link>
            <Link to="/events" className="w-full sm:w-auto px-12 py-5 bg-transparent border-2 border-[#C5A059]/40 text-[#C5A059] font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-[#C5A059]/10 hover:border-[#C5A059] transition-all flex items-center justify-center gap-3">
              Upcoming <Calendar size={20} />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#C5A059]/30 animate-bounce">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-32">
        <YearBanner settings={settings} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-32">
          {/* Links Section */}
          <section className="bg-[#001226] p-12 rounded-[3rem] border border-[#C5A059]/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl group-hover:bg-[#C5A059]/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight">
                  <div className="p-4 bg-[#C5A059]/10 rounded-2xl text-[#C5A059]"><LayoutGrid size={24} /></div> Quick Access
                </h3>
                <Link to="/links" className="text-[#C5A059] text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Full List <ArrowRight size={16} />
                </Link>
              </div>
              <div className="space-y-6">
                {featuredLinks.map(link => (
                  <a 
                    key={link.id} 
                    href={link.redirectUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group/item flex items-center gap-6 p-6 rounded-[2rem] bg-[#000B18]/50 hover:bg-[#C5A059]/5 transition-all border border-transparent hover:border-[#C5A059]/30"
                  >
                    <img src={link.iconUrl} alt={link.name} className="w-16 h-16 rounded-[1.25rem] object-cover shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover/item:scale-110 transition-transform" />
                    <div>
                      <h4 className="font-bold text-xl text-white group-hover/item:text-[#C5A059] transition-colors">{link.name}</h4>
                      <p className="text-slate-500 line-clamp-1 font-medium">{link.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Events Section */}
          <section className="bg-[#001226] p-12 rounded-[3rem] border border-[#C5A059]/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl group-hover:bg-[#C5A059]/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-black text-white flex items-center gap-4 tracking-tight">
                  <div className="p-4 bg-[#C5A059]/10 rounded-2xl text-[#C5A059]"><Calendar size={24} /></div> Featured Event
                </h3>
                <Link to="/events" className="text-[#C5A059] text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  View All <ArrowRight size={16} />
                </Link>
              </div>
              {nextEvent ? (
                <Link to={`/events/${nextEvent.id}`} className="block group/event">
                  <div className="relative overflow-hidden rounded-[2.5rem] aspect-[16/9] shadow-2xl border border-[#C5A059]/10">
                    <img src={nextEvent.bannerUrl} alt={nextEvent.title} className="w-full h-full object-cover group-hover/event:scale-110 transition-transform duration-1000 brightness-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000B18] via-transparent to-transparent flex flex-col justify-end p-10">
                      <p className="text-[#C5A059] text-xs font-black uppercase tracking-[0.2em] mb-3">{nextEvent.date}</p>
                      <h4 className="text-white text-3xl font-black leading-tight group-hover/event:text-[#C5A059] transition-colors">{nextEvent.title}</h4>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="h-48 bg-[#000B18]/50 rounded-[2.5rem] border border-dashed border-[#C5A059]/20 flex items-center justify-center text-slate-600 italic">
                  No upcoming featured events
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Biography Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-20 py-32 border-t border-[#C5A059]/10">
          <div className="space-y-8">
            <div className="inline-block px-5 py-1.5 bg-[#C5A059]/10 text-[#C5A059] font-black text-[10px] uppercase tracking-widest rounded-full border border-[#C5A059]/20">The Prophet</div>
            <h2 className="text-5xl font-black text-white tracking-tighter">Prophet Uebert Angel</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-light tracking-wide">
              Uebert Angel is a Zimbabwean-born Christian leader and founder of Spirit Embassy. Recognized globally for his prophetic ministry and leadership, he has built a dynamic international church network focused on faith, empowerment, and excellence. His ministry continues to influence lives through teaching, outreach, and innovation.
            </p>
            <div className="pt-4">
              <div className="h-1 w-24 bg-[#C5A059] rounded-full shadow-[0_0_15px_#C5A059]"></div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="inline-block px-5 py-1.5 bg-[#C5A059]/10 text-[#C5A059] font-black text-[10px] uppercase tracking-widest rounded-full border border-[#C5A059]/20">The Vision</div>
            <h2 className="text-5xl font-black text-white tracking-tighter">Spirit Embassy</h2>
            <p className="text-lg text-slate-400 leading-relaxed font-light tracking-wide">
              Spirit Embassy is a global Christian ministry founded in 2007. Committed to spreading the Gospel through prophetic teaching and spiritual growth, the ministry has established branches across multiple nations. It serves as a spiritual home for believers seeking transformation, purpose, and impact.
            </p>
            <div className="pt-4">
              <div className="h-1 w-24 bg-[#C5A059] rounded-full shadow-[0_0_15px_#C5A059]"></div>
            </div>
          </div>
        </section>

        {/* Dark Gold CTA */}
        <section className="mt-32 text-center bg-gradient-to-br from-[#001226] to-[#000B18] py-32 px-10 rounded-[4rem] border border-[#C5A059]/30 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[100px]"></div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Join the Digital Revolution</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-xl font-light tracking-wide">
              Stay connected to the prophetic flow. Access every platform, every word, every moment, all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
                <Link to="/links" className="bg-[#C5A059] text-[#000B18] px-14 py-6 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_15px_40px_rgba(197,160,89,0.4)] hover:-translate-y-2 transition-all">
                  Explore Ecosystem
                </Link>
                <Link to="/events" className="bg-transparent text-[#C5A059] border-2 border-[#C5A059]/40 px-14 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#C5A059]/10 transition-all">
                  Register for Service
                </Link>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.05); }
          50% { transform: scale(1.08); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;