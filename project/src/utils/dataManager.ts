import Database from './database';

// Data export/import utility for SQLite database
class DataManager {
  private static instance: DataManager;

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Export all data as JSON string
  async exportData(): Promise<string> {
    try {
      const db = Database.getInstance();

      const users = await db.getAllUsers();
      const commuteLogs = await db.getCommuteLogs();
      const communityStats = await db.getCommunityStats();

      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        users,
        commuteLogs,
        communityStats,
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Failed to export data');
    }
  }

  // Import data from JSON string
  async importData(jsonData: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonData);

      if (!importData.version || !importData.users || !importData.commuteLogs) {
        throw new Error('Invalid data format');
      }

      const db = Database.getInstance();

      // Clear existing data
      await db.clearAllData();

      // Import users
      for (const user of importData.users) {
        await db.createUser({
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          isAnonymous: user.isAnonymous,
        });
      }

      // Import commute logs
      for (const log of importData.commuteLogs) {
        await db.createCommuteLog({
          userId: log.userId,
          date: log.date,
          modes: log.modes,
          distance: log.distance,
          duration: log.duration,
          co2Saved: log.co2Saved,
          notes: log.notes,
        });
      }

      // Import community stats
      if (importData.communityStats) {
        await db.updateCommunityStats(importData.communityStats);
      }

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('Failed to import data: ' + (error as Error).message);
    }
  }

  // Download data as file
  downloadData(filename: string = 'ecopulse-backup.json'): void {
    this.exportData().then(data => {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    }).catch(error => {
      console.error('Failed to download data:', error);
      alert('Failed to download data. Please try again.');
    });
  }

  // Upload and import data from file
  uploadData(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          this.importData(data).then(resolve).catch(reject);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Clear all data (with confirmation)
  async clearAllData(): Promise<void> {
    if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      const db = Database.getInstance();
      await db.clearAllData();
      console.log('All data cleared');
    }
  }
}

export default DataManager;