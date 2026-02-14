
import React, { useState, useEffect, useMemo } from 'react';
import { dataService } from '../services/dataService';
import { ChurchEvent } from '../types';
import { Calendar as CalendarIcon, Users, MapPin, ChevronRight, LayoutGrid, ChevronLeft, Info, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const Events: React.FC = () => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await dataService.getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };
    loadEvents();
  }, []);

  const activeEvents = useMemo(() => 
    events.filter(e => e.status === 'active').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  , [events]);

  const pastEvents = useMemo(() => 
    events.filter(e => e.status === 'past').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  , [events]);

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = Array(startDay).fill(null);

    for (let day = 1; day <= days; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      weeks.push([...week, ...Array(7 - week.length).fill(null)]);
    }
    return weeks;
  }, [currentDate]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    setSelectedDate(null);
  };

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return getEventsForDay(selectedDate.getDate());
  }, [selectedDate, events, currentDate]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 bg-[#000B18]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
        <div>
          <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Calendar of Power</span>
          <h2 className="text-6xl font-black tracking-tighter text-white mb-4">Gatherings</h2>
          <p className="text-slate-500 text-lg">Experience the miraculous. Join us live from anywhere on earth.</p>
        </div>
        <div className="flex bg-[#001226] p-2 rounded-2xl self-start border border-[#C5A059]/20 shadow-xl">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-[#C5A059] text-[#000B18] shadow-[0_5px_20px_rgba(197,160,89,0.3)]' : 'text-slate-500 hover:text-[#C5A059]'}`}
          >
            <LayoutGrid size={18} /> Grid
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-[#C5A059] text-[#000B18] shadow-[0_5px_20px_rgba(197,160,89,0.3)]' : 'text-slate-500 hover:text-[#C5A059]'}`}
          >
            <CalendarIcon size={18} /> Calendar
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="space-y-32">
          {/* Active Events Section */}
          <section className="animate-in fade-in duration-500">
             <div className="flex items-center gap-4 mb-12">
               <div className="h-px flex-grow bg-gradient-to-r from-transparent to-[#C5A059]/20"></div>
               <h3 className="text-xl font-black uppercase tracking-[0.3em] text-[#C5A059]">Active Gatherings</h3>
               <div className="h-px flex-grow bg-gradient-to-l from-transparent to-[#C5A059]/20"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {activeEvents.map(event => (
                <Link 
                  key={event.id} 
                  to={`/events/${event.id}`}
                  className="group bg-[#001226] rounded-[3rem] overflow-hidden border border-[#C5A059]/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[#C5A059]/10 hover:border-[#C5A059]/30 transition-all flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75" />
                    <div className="absolute top-6 left-6 bg-[#C5A059] px-5 py-3 rounded-2xl flex flex-col items-center min-w-[4rem] shadow-2xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#000B18]">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-black text-[#000B18]">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <div className="flex items-center gap-5 text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-6">
                      <span className="flex items-center gap-2"><Users size={14} /> {event.attendees.toLocaleString()} Enrolled</span>
                      <span className="h-1.5 w-1.5 bg-[#C5A059]/30 rounded-full"></span>
                      <span className="flex items-center gap-2"><MapPin size={14} /> Virtual</span>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 group-hover:text-[#C5A059] transition-colors tracking-tight leading-tight">
                      {event.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
                      {event.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-[#C5A059]/10 group-hover:border-[#C5A059]/30 transition-colors">
                      <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">{event.time} GMT</span>
                      <span className="text-[#C5A059] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                        Register <ChevronRight size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
              {activeEvents.length === 0 && (
                <div className="col-span-full py-20 text-center text-slate-600 font-bold italic text-xl border-2 border-dashed border-[#C5A059]/10 rounded-[3rem]">
                  No active gatherings scheduled.
                </div>
              )}
            </div>
          </section>

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <section className="animate-in fade-in duration-700">
               <div className="flex items-center gap-4 mb-12">
                 <div className="h-px flex-grow bg-gradient-to-r from-transparent to-[#C5A059]/10"></div>
                 <h3 className="text-xl font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                   <History size={20} /> Previous Manifestations
                 </h3>
                 <div className="h-px flex-grow bg-gradient-to-l from-transparent to-[#C5A059]/10"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {pastEvents.map(event => (
                  <Link 
                    key={event.id} 
                    to={`/events/${event.id}`}
                    className="group bg-[#001226]/50 rounded-[2rem] overflow-hidden border border-[#C5A059]/5 shadow-xl hover:border-[#C5A059]/20 transition-all flex flex-col opacity-70 hover:opacity-100 grayscale-[0.5] hover:grayscale-0"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="bg-[#000B18]/60 text-[#C5A059] px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-[#C5A059]/20">Concluded</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="text-lg font-black text-white mb-2 group-hover:text-[#C5A059] transition-colors line-clamp-1">{event.title}</h4>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      <div className="mt-auto pt-4 border-t border-[#C5A059]/5 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-slate-600 italic">View Archive</span>
                         <ChevronRight size={14} className="text-[#C5A059]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-500">
          <div className="lg:col-span-2 bg-[#001226] rounded-[3rem] border border-[#C5A059]/20 shadow-2xl p-10 md:p-16">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-black text-white tracking-tight">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-4">
                <button onClick={() => changeMonth(-1)} className="p-3 bg-[#000B18] text-[#C5A059] rounded-xl border border-[#C5A059]/20 hover:bg-[#C5A059]/10 transition-all">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={() => changeMonth(1)} className="p-3 bg-[#000B18] text-[#C5A059] rounded-xl border border-[#C5A059]/20 hover:bg-[#C5A059]/10 transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059]/50 py-4">
                  {day}
                </div>
              ))}
              {calendarData.flat().map((day, idx) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                const hasActive = dayEvents.some(e => e.status === 'active');
                const hasPast = dayEvents.every(e => e.status === 'past') && dayEvents.length > 0;
                
                const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth();
                const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day || 0).toDateString();

                return (
                  <button
                    key={idx}
                    disabled={!day}
                    onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`relative aspect-square rounded-2xl md:rounded-[1.5rem] flex flex-col items-center justify-center transition-all ${
                      !day ? 'bg-transparent' : 
                      isSelected ? 'bg-[#C5A059] text-[#000B18] shadow-[0_0_30px_rgba(197,160,89,0.3)]' :
                      'bg-[#000B18]/50 text-slate-400 hover:bg-[#C5A059]/10 hover:border-[#C5A059]/30 border border-[#C5A059]/10'
                    }`}
                  >
                    <span className={`text-lg font-black ${isToday && !isSelected ? 'text-[#C5A059]' : ''} ${hasPast && !isSelected ? 'text-slate-600' : ''}`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className={`absolute bottom-3 md:bottom-4 flex gap-1 ${isSelected ? 'text-[#000B18]' : hasActive ? 'text-[#C5A059]' : 'text-slate-700'}`}>
                        {dayEvents.slice(0, 3).map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-current" />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#001226] rounded-[2.5rem] p-10 border border-[#C5A059]/20 shadow-xl h-full flex flex-col">
              <div className="flex items-center gap-4 text-[#C5A059] mb-10">
                <Info size={24} />
                <h4 className="text-xl font-black uppercase tracking-widest text-white">Daily Gatherings</h4>
              </div>
              
              <div className="flex-grow space-y-6 overflow-y-auto pr-2 max-h-[500px] scrollbar-thin scrollbar-thumb-[#C5A059]/20 scrollbar-track-transparent">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map(event => (
                    <Link 
                      key={event.id} 
                      to={`/events/${event.id}`}
                      className={`block p-6 bg-[#000B18] border rounded-2xl transition-all group ${event.status === 'past' ? 'border-slate-800/50 opacity-70 grayscale-[0.3]' : 'border-[#C5A059]/10 hover:border-[#C5A059]/40'}`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <img src={event.bannerUrl} alt="" className="w-12 h-12 rounded-lg object-cover brightness-75" />
                        <div>
                          <h5 className={`font-bold transition-colors ${event.status === 'past' ? 'text-slate-500' : 'text-white group-hover:text-[#C5A059]'}`}>{event.title}</h5>
                          <div className="flex items-center gap-2">
                             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{event.time} GMT</p>
                             {event.status === 'past' && <span className="bg-slate-800 text-slate-500 text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-widest">Past</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[#C5A059] text-[10px] font-black uppercase tracking-widest pt-4 border-t border-[#C5A059]/5">
                        <span>{event.status === 'past' ? 'View Archive' : 'Details'}</span>
                        <ChevronRight size={14} />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-20 text-slate-600">
                    <CalendarIcon size={48} className="mb-4 opacity-20" />
                    <p className="font-bold italic">
                      {selectedDate 
                        ? `No gatherings scheduled for ${selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}` 
                        : 'Select a date to view gatherings.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
