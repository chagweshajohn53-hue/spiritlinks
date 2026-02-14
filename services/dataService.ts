import { LinkItem, ChurchEvent } from '../types';
import { api } from './api';

// Service that requires database - no localStorage fallback
export const dataService = {
  // Links operations
  async getLinks(): Promise<LinkItem[]> {
    // Always use API - no fallback
    return await api.getLinks();
  },

  async addLink(linkData: Omit<LinkItem, 'id' | 'createdAt'>): Promise<void> {
    await api.addLink(linkData);
  },

  async deleteLink(id: string): Promise<void> {
    await api.deleteLink(id);
  },

  // Events operations
  async getEvents(): Promise<ChurchEvent[]> {
    // Always use API - no fallback
    return await api.getEvents();
  },

  async addEvent(eventData: Omit<ChurchEvent, 'id' | 'createdAt' | 'attendees' | 'status'>): Promise<void> {
    await api.addEvent(eventData);
  },

  async updateEvent(id: string, updates: Partial<ChurchEvent>): Promise<void> {
    await api.updateEvent(id, updates);
  },

  async deleteEvent(id: string): Promise<void> {
    await api.deleteEvent(id);
  }
};