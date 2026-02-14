
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { LinkItem, ChurchEvent, SystemSettings } from '../types';
import { Plus, Trash2, Edit3, Save, LayoutGrid, Calendar, Settings, LogOut, X, Image as ImageIcon, Upload, History, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'links' | 'events' | 'settings'>('links');
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(mockDb.getSettings());
  
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [newLink, setNewLink] = useState({ name: '', description: '', iconUrl: '', redirectUrl: '' });
  
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', bannerUrl: '', date: '', time: '', deadlineDate: '' });

  useEffect(() => {
    const auth = localStorage.getItem('expolink_auth');
    if (auth !== 'true') {
      navigate('/admin-login');
    }
    setLinks(mockDb.getLinks());
    setEvents(mockDb.getEvents());
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('expolink_auth');
    navigate('/');
  };

  const handleSaveSettings = () => {
    mockDb.saveSettings(settings);
    alert('Settings updated globally.');
  };

  const handleImageUpload = async (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddLink = () => {
    if (!newLink.name || !newLink.redirectUrl || !newLink.iconUrl) {
      alert("Please fill in all fields and upload an icon.");
      return;
    }
    mockDb.addLink(newLink);
    setLinks(mockDb.getLinks());
    setNewLink({ name: '', description: '', iconUrl: '', redirectUrl: '' });
    setIsAddingLink(false);
  };

  const handleUpdateLink = () => {
    if (!editingLink) return;
    if (!editingLink.name || !editingLink.redirectUrl || !editingLink.iconUrl) {
      alert("Please fill in all fields.");
      return;
    }
    mockDb.updateLink(editingLink.id, editingLink);
    setLinks(mockDb.getLinks());
    setEditingLink(null);
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('Delete this platform link?')) {
      mockDb.deleteLink(id);
      setLinks(mockDb.getLinks());
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.bannerUrl) {
      alert("Please fill in all fields.");
      return;
    }
    mockDb.addEvent(newEvent);
    setEvents(mockDb.getEvents());
    setNewEvent({ title: '', description: '', bannerUrl: '', date: '', time: '', deadlineDate: '' });
    setIsAddingEvent(false);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;
    mockDb.updateEvent(editingEvent.id, editingEvent);
    setEvents(mockDb.getEvents());
    setEditingEvent(null);
  };

  const toggleEventStatus = (event: ChurchEvent) => {
    const newStatus = event.status === 'active' ? 'past' : 'active';
    mockDb.updateEvent(event.id, { status: newStatus });
    setEvents(mockDb.getEvents());
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Permanently delete this event? This cannot be undone.')) {
      mockDb.deleteEvent(id);
      setEvents(mockDb.getEvents());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 bg-[#000B18]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
        <div>
          <span className="text-[#C5A059] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Command Center</span>
          <h2 className="text-6xl font-black text-white tracking-tighter">Dashboard</h2>
          <p className="text-slate-500 font-medium">Manage the digital spiritual ecosystem.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 bg-[#001226] text-[#C5A059] border border-[#C5A059]/20 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#000B18] transition-all shadow-2xl"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <TabButton active={activeTab === 'links'} onClick={() => setActiveTab('links')} icon={<LayoutGrid size={18} />} label="Links" />
        <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar size={18} />} label="Events" />
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Settings" />
      </div>

      <div className="bg-[#001226] rounded-[3.5rem] border border-[#C5A059]/20 shadow-2xl overflow-hidden min-h-[600px]">
        {activeTab === 'links' && (
          <div className="p-10 md:p-16">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase tracking-widest">Platform Links</h3>
              {!isAddingLink && !editingLink && (
                <button 
                  onClick={() => setIsAddingLink(true)}
                  className="flex items-center gap-2 bg-[#C5A059] text-[#000B18] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                >
                  <Plus size={18} /> New Link
                </button>
              )}
            </div>

            {(isAddingLink || editingLink) && (
              <div className="mb-16 p-10 bg-[#000B18] border border-[#C5A059]/30 rounded-[2.5rem] animate-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-center mb-10">
                  <h4 className="font-black text-[#C5A059] uppercase tracking-widest text-sm">{editingLink ? 'Edit Platform' : 'Initialize Platform'}</h4>
                  <button onClick={() => { setIsAddingLink(false); setEditingLink(null); }} className="text-slate-500 hover:text-white"><X size={24} /></button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                  <div className="space-y-6">
                    <Input 
                      label="Display Name" 
                      value={editingLink ? editingLink.name : newLink.name} 
                      onChange={v => editingLink ? setEditingLink({...editingLink, name: v}) : setNewLink({...newLink, name: v})} 
                    />
                    <Input 
                      label="Protocol URL" 
                      value={editingLink ? editingLink.redirectUrl : newLink.redirectUrl} 
                      onChange={v => editingLink ? setEditingLink({...editingLink, redirectUrl: v}) : setNewLink({...newLink, redirectUrl: v})} 
                    />
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#C5A059] mb-3 ml-2 tracking-widest">Manifestation Description</label>
                      <textarea 
                        value={editingLink ? editingLink.description : newLink.description}
                        onChange={e => editingLink ? setEditingLink({...editingLink, description: e.target.value}) : setNewLink({...newLink, description: e.target.value})}
                        className="w-full p-5 bg-[#001226] border border-[#C5A059]/20 rounded-2xl text-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none h-32 font-medium"
                      />
                    </div>
                  </div>
                  <ImageUploader 
                    label="Platform Icon" 
                    value={editingLink ? editingLink.iconUrl : newLink.iconUrl} 
                    onFileSelect={(file) => handleImageUpload(file, (b64) => {
                      if (editingLink) setEditingLink({...editingLink, iconUrl: b64});
                      else setNewLink(prev => ({...prev, iconUrl: b64}));
                    })}
                  />
                </div>
                <button 
                  onClick={editingLink ? handleUpdateLink : handleAddLink} 
                  className="w-full py-6 bg-[#C5A059] text-[#000B18] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3"
                >
                  <Save size={20} /> {editingLink ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {links.map(link => (
                <div key={link.id} className="flex items-center justify-between p-8 bg-[#000B18]/50 border border-[#C5A059]/10 rounded-3xl hover:border-[#C5A059]/40 transition-all group">
                  <div className="flex items-center gap-6">
                    <img src={link.iconUrl} alt={link.name} className="w-16 h-16 rounded-2xl object-cover shadow-2xl group-hover:scale-105 transition-transform" />
                    <div className="max-w-[150px] md:max-w-xs overflow-hidden">
                      <h4 className="font-black text-white text-xl tracking-tight mb-1 truncate">{link.name}</h4>
                      <p className="text-[10px] text-[#C5A059] font-black uppercase tracking-widest truncate">{link.redirectUrl}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { setEditingLink(link); setIsAddingLink(false); setEditingEvent(null); setIsAddingEvent(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      className="p-3 text-slate-500 hover:text-[#C5A059] bg-[#001226] rounded-xl border border-transparent hover:border-[#C5A059]/30 transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDeleteLink(link.id)} className="p-3 text-slate-500 hover:text-red-500 bg-[#001226] rounded-xl border border-transparent hover:border-red-500/30 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="p-10 md:p-16">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase tracking-widest">Gathering Lifecycle</h3>
              {!isAddingEvent && !editingEvent && (
                <button 
                  onClick={() => setIsAddingEvent(true)}
                  className="flex items-center gap-2 bg-[#C5A059] text-[#000B18] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                >
                  <Plus size={18} /> New Gathering
                </button>
              )}
            </div>

            {(isAddingEvent || editingEvent) && (
              <div className="mb-16 p-10 bg-[#000B18] border border-[#C5A059]/30 rounded-[2.5rem] animate-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-center mb-10">
                  <h4 className="font-black text-[#C5A059] uppercase tracking-widest text-sm">{editingEvent ? 'Edit Gathering' : 'Initialize Gathering'}</h4>
                  <button onClick={() => { setIsAddingEvent(false); setEditingEvent(null); }} className="text-slate-500"><X size={24} /></button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                  <div className="space-y-6">
                    <Input 
                      label="Event Title" 
                      value={editingEvent ? editingEvent.title : newEvent.title} 
                      onChange={v => editingEvent ? setEditingEvent({...editingEvent, title: v}) : setNewEvent({...newEvent, title: v})} 
                    />
                    <div className="grid grid-cols-2 gap-6">
                      <Input 
                        label="Gathering Date" 
                        value={editingEvent ? editingEvent.date : newEvent.date} 
                        onChange={v => editingEvent ? setEditingEvent({...editingEvent, date: v}) : setNewEvent({...newEvent, date: v})} 
                      />
                      <Input 
                        label="Start Time" 
                        value={editingEvent ? editingEvent.time : newEvent.time} 
                        onChange={v => editingEvent ? setEditingEvent({...editingEvent, time: v}) : setNewEvent({...newEvent, time: v})} 
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                       <Input 
                        label="Registration Deadline (Optional)" 
                        value={editingEvent ? (editingEvent.deadlineDate || '') : newEvent.deadlineDate} 
                        onChange={v => editingEvent ? setEditingEvent({...editingEvent, deadlineDate: v}) : setNewEvent({...newEvent, deadlineDate: v})} 
                      />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-[#C5A059] mb-3 ml-2 tracking-widest">About gathering</label>
                      <textarea 
                        value={editingEvent ? editingEvent.description : newEvent.description}
                        onChange={e => editingEvent ? setEditingEvent({...editingEvent, description: e.target.value}) : setNewEvent({...newEvent, description: e.target.value})}
                        className="w-full p-5 bg-[#001226] border border-[#C5A059]/20 rounded-2xl text-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none h-40 font-medium"
                      />
                    </div>
                  </div>
                  <ImageUploader 
                    label="Gathering Banner" 
                    aspectRatio="video"
                    value={editingEvent ? editingEvent.bannerUrl : newEvent.bannerUrl} 
                    onFileSelect={(file) => handleImageUpload(file, (b64) => {
                      if (editingEvent) setEditingEvent({...editingEvent, bannerUrl: b64});
                      else setNewEvent(prev => ({...prev, bannerUrl: b64}));
                    })}
                  />
                </div>
                <button 
                  onClick={editingEvent ? handleUpdateEvent : handleAddEvent} 
                  className="w-full py-6 bg-[#C5A059] text-[#000B18] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3"
                >
                  <Save size={20} /> {editingEvent ? 'Synchronize Record' : 'Publish to Gateway'}
                </button>
              </div>
            )}

            <div className="space-y-6">
              {events.map(event => (
                <div key={event.id} className={`flex items-center justify-between p-8 bg-[#000B18]/50 border rounded-[2.5rem] transition-all group ${event.status === 'past' ? 'border-slate-800 opacity-60 grayscale-[0.3]' : 'border-[#C5A059]/10 hover:border-[#C5A059]/40'}`}>
                  <div className="flex items-center gap-8">
                    <img src={event.bannerUrl} alt={event.title} className="w-32 h-20 rounded-2xl object-cover shadow-2xl" />
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                         <h4 className={`font-black text-2xl tracking-tighter ${event.status === 'past' ? 'text-slate-500' : 'text-white'}`}>{event.title}</h4>
                         <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${event.status === 'past' ? 'bg-slate-900 text-slate-600 border-slate-700' : 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20'}`}>
                            {event.status}
                         </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{event.date} // {event.time} GMT // {event.attendees} ENROLLED</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => toggleEventStatus(event)} 
                      title={event.status === 'active' ? 'Move to History' : 'Move to Active'}
                      className={`p-4 rounded-2xl border transition-all ${event.status === 'active' ? 'text-slate-500 hover:text-amber-500 border-transparent hover:border-amber-500/30' : 'text-slate-500 hover:text-[#C5A059] border-transparent hover:border-[#C5A059]/30'}`}
                    >
                      {event.status === 'active' ? <History size={20} /> : <AlertCircle size={20} />}
                    </button>
                    <button 
                      onClick={() => { setEditingEvent(event); setIsAddingEvent(false); setEditingLink(null); setIsAddingLink(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      className="p-4 text-slate-500 hover:text-[#C5A059] bg-[#001226] rounded-2xl border border-transparent hover:border-[#C5A059]/30 transition-all"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="p-4 text-slate-500 hover:text-red-500 bg-[#001226] rounded-2xl border border-transparent hover:border-red-500/30 transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-10 md:p-20 max-w-3xl">
            <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-16">System Core Settings</h3>
            <div className="space-y-10 mb-16">
              <div>
                <label className="block text-[10px] font-black uppercase text-[#C5A059] mb-4 ml-2 tracking-widest">Prophetic Temporal Year</label>
                <input 
                  type="number" 
                  value={settings.year}
                  onChange={e => setSettings({...settings, year: parseInt(e.target.value)})}
                  className="w-full p-6 bg-[#000B18] border border-[#C5A059]/20 rounded-2xl text-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none font-bold text-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-[#C5A059] mb-4 ml-2 tracking-widest">Celestial Theme Declaration</label>
                <textarea 
                  value={settings.theme}
                  onChange={e => setSettings({...settings, theme: e.target.value})}
                  className="w-full p-6 bg-[#000B18] border border-[#C5A059]/20 rounded-2xl text-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none h-32 font-medium text-lg leading-relaxed"
                />
              </div>
            </div>
            <button 
              onClick={handleSaveSettings}
              className="flex items-center gap-3 bg-[#C5A059] text-[#000B18] px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(197,160,89,0.3)] hover:-translate-y-1 transition-all"
            >
              <Save size={20} /> Global Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
      active ? 'bg-[#C5A059] text-[#000B18] shadow-2xl' : 'bg-[#001226] text-slate-500 border border-[#C5A059]/10 hover:border-[#C5A059]/40'
    }`}
  >
    {icon} {label}
  </button>
);

const Input: React.FC<{ label: string, value: string, onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-[10px] font-black uppercase text-[#C5A059] mb-3 ml-2 tracking-widest">{label}</label>
    <input 
      type="text" 
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full p-5 bg-[#001226] border border-[#C5A059]/20 rounded-2xl text-white focus:ring-2 focus:ring-[#C5A059] focus:outline-none font-medium placeholder:text-slate-700"
      placeholder={`Set ${label.toLowerCase()}`}
    />
  </div>
);

const ImageUploader: React.FC<{ 
  label: string, 
  value: string, 
  onFileSelect: (file: File) => void,
  aspectRatio?: 'square' | 'video' 
}> = ({ label, value, onFileSelect, aspectRatio = 'square' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col h-full">
      <label className="block text-[10px] font-black uppercase text-[#C5A059] mb-3 ml-2 tracking-widest">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed border-[#C5A059]/20 bg-[#000B18] rounded-[2rem] flex flex-col items-center justify-center p-6 hover:border-[#C5A059] hover:bg-[#C5A059]/5 transition-all overflow-hidden flex-grow ${
          aspectRatio === 'square' ? 'aspect-square' : 'aspect-video'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onFileSelect(e.target.files[0]);
            }
          }}
        />
        
        {value ? (
          <div className="absolute inset-0 w-full h-full">
            <img src={value} alt="Preview" className="w-full h-full object-cover group" />
            <div className="absolute inset-0 bg-[#000B18]/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[#C5A059] font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Upload size={20} /> Replace Asset</span>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-600">
            <div className="bg-[#001226] p-6 rounded-full mb-4 inline-block border border-[#C5A059]/10">
              <ImageIcon size={40} className="text-[#C5A059]/30" />
            </div>
            <p className="font-black text-[10px] uppercase tracking-widest text-slate-500">Upload Visual Asset</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
