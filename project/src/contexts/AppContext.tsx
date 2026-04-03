import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { User, CommuteLog, CommunityStats } from '../types';
import Database from '../utils/database';

export const [AppProvider, useApp] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSettings, setUserSettings] = useState<{ monthlyGoal: number }>({ monthlyGoal: 10 });
  const queryClient = useQueryClient();

  // Load user from database
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const db = Database.getInstance();
        const users = await db.getAllUsers();
        return users.length > 0 ? users[0] : null;
      } catch (error) {
        console.error('Error loading user:', error);
        return null;
      }
    },
  });

  // Load commute logs
  const commuteLogsQuery = useQuery({
    queryKey: ['commuteLogs'],
    queryFn: async () => {
      try {
        const db = Database.getInstance();
        return await db.getCommuteLogs();
      } catch (error) {
        console.error('Error loading commute logs:', error);
        return [];
      }
    },
  });

  // Load user settings
  const userSettingsQuery = useQuery({
    queryKey: ['userSettings'],
    queryFn: async () => {
      try {
        const db = Database.getInstance();
        if (user) {
          return await db.getUserSettings(user.id);
        }
        return { monthlyGoal: 10 };
      } catch (error) {
        console.error('Error loading user settings:', error);
        return { monthlyGoal: 10 };
      }
    },
    enabled: !!user,
  });

  // Load community stats
  const communityStatsQuery = useQuery({
    queryKey: ['communityStats'],
    queryFn: async () => {
      try {
        const db = Database.getInstance();
        return await db.getCommunityStats();
      } catch (error) {
        console.error('Error loading community stats:', error);
        return {
          totalUsers: 1,
          totalCO2Saved: 0,
          totalCO2SavedThisWeek: 0,
          mostPopularMode: 'walking',
          totalCommutes: 0,
        };
      }
    },
  });

  // Register user mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: Omit<User, 'id' | 'createdAt'>) => {
      const db = Database.getInstance();

      // Existing user path for same email (login-like behavior)
      if (userData.email) {
        const existingUser = await db.getUserByEmail(userData.email);
        if (existingUser) {
          return existingUser;
        }
      }

      const newUser = await db.createUser(userData);

      // Update community stats
      const currentStats = await db.getCommunityStats();
      const updatedStats = {
        ...currentStats,
        totalUsers: currentStats.totalUsers + 1,
      };

      await db.updateCommunityStats(updatedStats);

      return newUser;
    },
    onSuccess: (newUser) => {
      setUser(newUser);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['communityStats'] });
    },
  });

  // Add commute log mutation
  const addCommuteLogMutation = useMutation({
    mutationFn: async (logData: Omit<CommuteLog, 'id' | 'userId' | 'createdAt'>) => {
      if (!user) throw new Error('User not found');

      const db = Database.getInstance();
      const newLog = await db.createCommuteLog({
        ...logData,
        userId: user.id,
      });

      // Update community stats
      const currentStats = await db.getCommunityStats();
      const isThisWeek = new Date(newLog.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

      const updatedStats: CommunityStats = {
        ...currentStats,
        totalCO2Saved: currentStats.totalCO2Saved + newLog.co2Saved,
        totalCO2SavedThisWeek: currentStats.totalCO2SavedThisWeek + (isThisWeek ? newLog.co2Saved : 0),
        totalCommutes: currentStats.totalCommutes + 1,
        mostPopularMode: newLog.modes[0] || currentStats.mostPopularMode,
      };

      await db.updateCommunityStats(updatedStats);

      return newLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commuteLogs'] });
      queryClient.invalidateQueries({ queryKey: ['communityStats'] });
    },
  });

  // Update user settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: { monthlyGoal: number }) => {
      if (!user) throw new Error('User not found');

      const db = Database.getInstance();
      await db.updateUserSettings(user.id, settings);
      return settings;
    },
    onSuccess: (settings) => {
      setUserSettings(settings);
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // For logout, we just clear the user state but keep data in database
      return true;
    },
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  useEffect(() => {
    if (userQuery.data !== undefined) {
      setUser(userQuery.data);
      setIsLoading(false);
    }
  }, [userQuery.data]);

  useEffect(() => {
    if (userSettingsQuery.data) {
      setUserSettings(userSettingsQuery.data);
    }
  }, [userSettingsQuery.data]);

  return {
    user,
    userSettings,
    isLoading: isLoading || userQuery.isLoading,
    commuteLogs: commuteLogsQuery.data || [],
    communityStats: communityStatsQuery.data,
    register: registerMutation.mutateAsync,
    addCommuteLog: addCommuteLogMutation.mutate,
    updateSettings: updateSettingsMutation.mutate,
    logout: logoutMutation.mutate,
    isRegistering: registerMutation.isPending,
    isAddingLog: addCommuteLogMutation.isPending,
  };
});
