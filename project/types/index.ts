export interface User {
  id: string;
  name: string;
  email?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  profession?: string;
  isAnonymous: boolean;
  createdAt: Date;
}

export interface CommuteLog {
  id: string;
  userId: string;
  modes: string[];
  distanceRange: string;
  commuteTime: number; // minutes
  frequency: string;
  co2Saved: number; // kg
  createdAt: Date;
  date: string; // YYYY-MM-DD format
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

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'streak' | 'total' | 'mode' | 'distance';
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date;
}
