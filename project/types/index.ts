export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface CommuteLog {
  id: string;
  userId: string;
  date: string;
  modes: string[];
  distance: number;
  co2Saved: number;
  createdAt: Date;
}

export interface CommunityStats {
  totalUsers: number;
  totalCO2Saved: number;
  totalCO2SavedThisWeek: number;
  mostPopularMode: string;
  totalCommutes: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalCO2Saved: number;
  rank: number;
  isAnonymous: boolean;
}