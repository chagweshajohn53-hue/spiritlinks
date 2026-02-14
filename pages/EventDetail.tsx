
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { ChurchEvent } from '../types';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, CheckCircle2, AlertCircle } from 'lucide-react';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);

  useEffect(() => {
    if (id) {
      const found = mockDb.getEvents().find(e => e.id === id);
      if (found) {
        setEvent(found);
        setAttendeeCount(found.attendees);
      }
    }
  }, [id]);

  const handleAttend = () => {
    if (event && !isAttending && event.status === 'active') {
      mockDb.incrementAttendees(event.id);
      setAttendeeCount(prev => prev + 1);
      setIsAttending(true);
    }
  };

  if (!event) return <div className="p-32 text-center text-slate-500 font-bold text-2xl tracking-tighter">Event lost in the prophetic stream...</div>;

  const isPast = event.status === 'past';

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 bg-[#000B18]">
      <Link to="/events" className="inline-flex items-center gap-3 text-[#C5A059] hover:text-[#F3E5AB] font-black text-xs uppercase tracking-[0.2em] mb-12 transition-all group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Return to Gatherings
      </Link>

      <div className={`bg-[#001226] rounded-[3.5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.6)] border ${isPast ? 'border-slate-800' : 'border-[#C5A059]/20'}`}>
        <div className="relative aspect-[21/9] w-full border-b border-[#C5A059]/20">
          <img src={event.bannerUrl} alt={event.title} className={`w-full h-full object-cover brightness-50 ${isPast ? 'grayscale-[0.5]' : ''}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001226] via-[#001226]/20 to-transparent"></div>
          
          {isPast && (
            <div className="absolute top-12 right-12 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-6 py-2 rounded-full text-slate-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14} /> Archival Record
            </div>
          )}

          <div className="absolute bottom-12 left-12 right-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight">{event.title}</h1>
            <div className="flex flex-wrap gap-8">
              <span className={`flex items-center gap-3 bg-[#C5A059]/10 backdrop-blur-xl border border-[#C5A059]/30 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest ${isPast ? 'text-slate-500' : 'text-[#C5A059]'}`}>
                <Calendar size={18} /> {new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'full' })}
              </span>
              <span className={`flex items-center gap-3 bg-[#C5A059]/10 backdrop-blur-xl border border-[#C5A059]/30 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest ${isPast ? 'text-slate-500' : 'text-[#C5A059]'}`}>
                <Clock size={18} /> {event.time} GMT
              </span>
            </div>
          </div>
        </div>

        <div className="p-12 md:p-20 grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h3 className={`text-sm font-black mb-6 uppercase tracking-[0.3em] flex items-center gap-4 ${isPast ? 'text-slate-600' : 'text-[#C5A059]'}`}>
                {isPast ? 'Legacy Details' : 'Manifestation Details'} <div className={`h-px flex-grow ${isPast ? 'bg-slate-800' : 'bg-[#C5A059]/20'}`}></div>
              </h3>
              <p className="text-slate-400 text-xl leading-relaxed font-light tracking-wide whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
            
            <div className={`grid grid-cols-2 gap-8 pt-10 border-t ${isPast ? 'border-slate-800' : 'border-[#C5A059]/10'}`}>
                <div className="space-y-2">
                    <p className={`${isPast ? 'text-slate-600' : 'text-[#C5A059]'} font-black text-[10px] uppercase tracking-widest`}>Global Reach</p>
                    <p className="text-white font-bold text-lg">Worldwide Broadcast</p>
                </div>
                <div className="space-y-2">
                    <p className={`${isPast ? 'text-slate-600' : 'text-[#C5A059]'} font-black text-[10px] uppercase tracking-widest`}>Status</p>
                    <p className="text-white font-bold text-lg">{isPast ? 'Concluded' : 'Open Registration'}</p>
                </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`bg-[#000B18] rounded-[2.5rem] p-10 border shadow-inner relative overflow-hidden group ${isPast ? 'border-slate-800' : 'border-[#C5A059]/30'}`}>
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-2xl group-hover:bg-[#C5A059]/10 transition-all"></div>
              <div className="text-center mb-10">
                <div className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">{isPast ? 'Total Attendance' : 'Confirmed Enrollees'}</div>
                <div className="text-5xl font-black text-white flex items-center justify-center gap-3 tracking-tighter">
                  <Users className={isPast ? 'text-slate-600' : 'text-[#C5A059]'} size={36} />
                  {attendeeCount.toLocaleString()}
                </div>
              </div>

              {isPast ? (
                <div className="w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest bg-slate-900/50 text-slate-600 border border-slate-800 text-center">
                   Event Concluded
                </div>
              ) : (
                <button 
                  onClick={handleAttend}
                  disabled={isAttending}
                  className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                    isAttending 
                      ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/40 cursor-default' 
                      : 'bg-[#C5A059] text-[#000B18] shadow-[0_15px_40px_rgba(197,160,89,0.4)] hover:shadow-[#C5A059]/60 hover:-translate-y-1 active:scale-[0.98]'
                  }`}
                >
                  {isAttending ? (
                    <> <CheckCircle2 size={24} /> Verified </>
                  ) : (
                    'Join Gathering'
                  )}
                </button>
              )}
              
              <p className="text-center mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                {isPast ? 'This event has concluded. View the archive above.' : isAttending ? 'Prophetic positioning confirmed.' : 'Secure your position in the upcoming service.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="py-4 bg-transparent border border-[#C5A059]/20 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 text-slate-400 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all">
                <Share2 size={16} /> Broadcast
              </button>
              <div className={`rounded-2xl p-4 flex items-center justify-center border ${isPast ? 'bg-slate-900/20 border-slate-800' : 'bg-[#C5A059]/5 border-[#C5A059]/10'}`}>
                <span className={`${isPast ? 'text-slate-600' : 'text-[#C5A059]'} font-black text-[9px] uppercase tracking-[0.2em] text-center leading-tight`}>
                  {isPast ? 'Historic Protocol' : 'Elite Access Protocol'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
