
export interface LinkItem {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  redirectUrl: string;
  createdAt: number;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  date: string; // ISO string YYYY-MM-DD
  time: string;
  deadlineDate?: string; // ISO string YYYY-MM-DD
  status: 'active' | 'past';
  attendees: number;
  createdAt: number;
}

export interface SystemSettings {
  year: number;
  theme: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}
