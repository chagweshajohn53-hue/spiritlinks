import { LinkItem, ChurchEvent } from '../types';
import { mockDb } from './mockDb';
import { api } from './api';

// Service that automatically switches between API and localStorage
export const dataService = {
  // Links operations
  async getLinks(): Promise<LinkItem[]> {
    try {
      // Try API first
      return await api.getLinks();
    } catch (error) {
      // Fallback to localStorage
      console.warn('API unavailable, using localStorage:', error);
      return mockDb.getLinks();
    }
  },

  async addLink(linkData: Omit<LinkItem, 'id' | 'createdAt'>): Promise<void> {
    try {
      await api.addLink(linkData);
    } catch (error) {
      console.warn('API unavailable, using localStorage:', error);
      mockDb.addLink(linkData);
    }
  },

  async deleteLink(id: string): Promise<void> {
    try {
      await api.deleteLink(id);
    } catch (error) {
      console.warn('API unavailable, using localStorage:', error);
      mockDb.deleteLink(id);
    }
  },

  // Events operations
  async getEvents(): Promise<ChurchEvent[]> {
    try {
      return await api.getEvents();
    } catch (error) {
      console.warn('API unavailable, using localStorage:', error);
      return mockDb.getEvents();
    }
  },

  async addEvent(eventData: Omit<ChurchEvent, 'id' | 'createdAt' | 'attendees' | 'status'>): Promise<void> {
    try {
      await api.addEvent(eventData);
    } catch (error) {
      console.warn('API unavailable, using localStorage:', error);
      mockDb.addEvent(eventData);
    }
  },

  async updateEvent(id: string, updates: Partial<ChurchEvent>): Promise<void> {
    try {
      await api.updateEvent(id, updates);
    } catch (error) {
      console.warn('API unavailable, using localStorage:', error);
      mockDb.updateEvent(id, updates);
    }
  },

  async deleteEvent(id: string): Promise<void> {
    try {
      await api.deleteEvent(id);
    } catch (error) {
      console.warn('API unavailable, using localStorage:', error);
      mockDb.deleteEvent(id);
    }
  }
};