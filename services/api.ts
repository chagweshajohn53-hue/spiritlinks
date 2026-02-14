const API_BASE = '/.netlify/functions';

export const api = {
  // Links operations
  async getLinks() {
    try {
      const response = await fetch(`${API_BASE}/links`);
      if (!response.ok) throw new Error('Failed to fetch links');
      return await response.json();
    } catch (error) {
      console.error('API Error - getLinks:', error);
      throw error;
    }
  },

  async addLink(linkData: { name: string; description: string; iconUrl: string; redirectUrl: string }) {
    try {
      const response = await fetch(`${API_BASE}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData)
      });
      if (!response.ok) throw new Error('Failed to add link');
      return await response.json();
    } catch (error) {
      console.error('API Error - addLink:', error);
      throw error;
    }
  },

  async deleteLink(id: string) {
    try {
      const response = await fetch(`${API_BASE}/links`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!response.ok) throw new Error('Failed to delete link');
      return await response.json();
    } catch (error) {
      console.error('API Error - deleteLink:', error);
      throw error;
    }
  },

  // Events operations
  async getEvents() {
    try {
      const response = await fetch(`${API_BASE}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('API Error - getEvents:', error);
      throw error;
    }
  },

  async addEvent(eventData: { 
    title: string; 
    description: string; 
    bannerUrl: string; 
    date: string; 
    time: string; 
    deadlineDate?: string 
  }) {
    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error('Failed to add event');
      return await response.json();
    } catch (error) {
      console.error('API Error - addEvent:', error);
      throw error;
    }
  },

  async updateEvent(id: string, updates: any) {
    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      });
      if (!response.ok) throw new Error('Failed to update event');
      return await response.json();
    } catch (error) {
      console.error('API Error - updateEvent:', error);
      throw error;
    }
  },

  async deleteEvent(id: string) {
    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!response.ok) throw new Error('Failed to delete event');
      return await response.json();
    } catch (error) {
      console.error('API Error - deleteEvent:', error);
      throw error;
    }
  }
};