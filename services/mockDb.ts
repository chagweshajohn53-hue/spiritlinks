
import { LinkItem, ChurchEvent, SystemSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

const KEYS = {
  LINKS: 'expolink_apps',
  EVENTS: 'expolink_events',
  SETTINGS: 'expolink_settings'
};

const INITIAL_LINKS: LinkItem[] = [
  {
    id: '1',
    name: 'AtomGram',
    description: 'The social network for the Spirit-filled believer.',
    iconUrl: 'https://picsum.photos/seed/atom/200',
    redirectUrl: 'https://atomgram.com',
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'GoodNews World',
    description: 'Access the latest messages and prophetic words.',
    iconUrl: 'https://picsum.photos/seed/gnw/200',
    redirectUrl: 'https://goodnewsworld.com',
    createdAt: Date.now()
  }
];

const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: '1',
    title: 'New Year Eve Global Service',
    description: 'Join the Prophet of God for a night of power and transition.',
    bannerUrl: 'https://picsum.photos/seed/nye/1200/600',
    date: '2025-12-31',
    time: '20:00',
    deadlineDate: '2025-12-30',
    status: 'active',
    attendees: 15420,
    createdAt: Date.now()
  },
  {
    id: 'past-1',
    title: 'Night of Bliss 2024',
    description: 'A powerful encounter that transformed thousands of lives globally.',
    bannerUrl: 'https://picsum.photos/seed/bliss/1200/600',
    date: '2024-06-15',
    time: '18:00',
    status: 'past',
    attendees: 8500,
    createdAt: Date.now() - 1000000
  }
];

export const mockDb = {
  getLinks: (): LinkItem[] => {
    const data = localStorage.getItem(KEYS.LINKS);
    return data ? JSON.parse(data) : INITIAL_LINKS;
  },
  saveLinks: (links: LinkItem[]) => {
    localStorage.setItem(KEYS.LINKS, JSON.stringify(links));
  },
  addLink: (link: Omit<LinkItem, 'id' | 'createdAt'>) => {
    const links = mockDb.getLinks();
    const newLink = { ...link, id: Math.random().toString(36).substr(2, 9), createdAt: Date.now() };
    mockDb.saveLinks([...links, newLink]);
  },
  updateLink: (id: string, updatedLink: Partial<LinkItem>) => {
    const links = mockDb.getLinks();
    mockDb.saveLinks(links.map(l => l.id === id ? { ...l, ...updatedLink } : l));
  },
  deleteLink: (id: string) => {
    const links = mockDb.getLinks();
    mockDb.saveLinks(links.filter(a => a.id !== id));
  },

  getEvents: (): ChurchEvent[] => {
    const data = localStorage.getItem(KEYS.EVENTS);
    const events: ChurchEvent[] = data ? JSON.parse(data) : INITIAL_EVENTS;
    
    // Auto-update status based on date/deadline
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const updatedEvents = events.map(event => {
      const eventDate = new Date(event.date);
      const deadlineDate = event.deadlineDate ? new Date(event.deadlineDate) : null;
      
      // If today is past the event date or past the deadline, it should be past
      // except if manually set otherwise, though logic usually dictates past is past.
      let autoStatus = event.status;
      if (eventDate < now || (deadlineDate && deadlineDate < now)) {
        autoStatus = 'past';
      }
      
      return { ...event, status: autoStatus };
    });

    return updatedEvents;
  },
  saveEvents: (events: ChurchEvent[]) => {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  },
  addEvent: (event: Omit<ChurchEvent, 'id' | 'createdAt' | 'attendees' | 'status'>) => {
    const events = mockDb.getEvents();
    const newEvent: ChurchEvent = { 
      ...event, 
      id: Math.random().toString(36).substr(2, 9), 
      createdAt: Date.now(), 
      attendees: 0,
      status: 'active'
    };
    mockDb.saveEvents([...events, newEvent]);
  },
  updateEvent: (id: string, updatedEvent: Partial<ChurchEvent>) => {
    const events = mockDb.getEvents();
    mockDb.saveEvents(events.map(e => e.id === id ? { ...e, ...updatedEvent } : e));
  },
  deleteEvent: (id: string) => {
    const events = mockDb.getEvents();
    mockDb.saveEvents(events.filter(e => e.id !== id));
  },
  incrementAttendees: (id: string) => {
    const events = mockDb.getEvents();
    mockDb.saveEvents(events.map(e => e.id === id ? { ...e, attendees: e.attendees + 1 } : e));
  },

  getSettings: (): SystemSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },
  saveSettings: (settings: SystemSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }
};
