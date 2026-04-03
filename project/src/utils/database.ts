import initSqlJs from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

// SQLite database utility
class Database {
  private static instance: Database;
  private db: any = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: () => sqlWasmUrl
      });

      // Try to load existing database from localStorage
      const savedDbData = localStorage.getItem('ecopulse_sqlite_db');
      if (savedDbData) {
        try {
          const dbArray = new Uint8Array(JSON.parse(savedDbData));
          this.db = new SQL.Database(dbArray);
        } catch (loadError) {
          console.warn('Failed to restore database from localStorage; reinitializing fresh DB.', loadError);
          this.db = new SQL.Database();
          this.createTables();
          this.saveToStorage();
        }
      } else {
        this.db = new SQL.Database();
        this.createTables();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
      throw error;
    }
  }

  private createTables(): void {
    if (!this.db) return;

    // Create users table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        avatar TEXT,
        createdAt TEXT NOT NULL,
        isAnonymous INTEGER DEFAULT 0
      )
    `);

    // Create commute_logs table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS commute_logs (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        date TEXT NOT NULL,
        modes TEXT NOT NULL, -- JSON string array
        distance REAL,
        duration INTEGER,
        co2Saved REAL NOT NULL,
        notes TEXT,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `);

    // Create user_settings table
    this.db.run(`
      CREATE TABLE IF NOT EXISTS user_settings (
        userId TEXT PRIMARY KEY,
        monthlyGoal REAL DEFAULT 10,
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `);

    // Create community_stats table (for caching)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS community_stats (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        totalUsers INTEGER DEFAULT 0,
        totalCO2Saved REAL DEFAULT 0,
        totalCO2SavedThisWeek REAL DEFAULT 0,
        mostPopularMode TEXT DEFAULT 'walking',
        totalCommutes INTEGER DEFAULT 0,
        lastUpdated TEXT
      )
    `);

    // Insert default community stats if not exists
    this.db.run(`
      INSERT OR IGNORE INTO community_stats (id, totalUsers, totalCO2Saved, totalCO2SavedThisWeek, mostPopularMode, totalCommutes)
      VALUES (1, 0, 0, 0, 'walking', 0)
    `);
  }

  private saveToStorage(): void {
    if (!this.db) return;

    try {
      const data = this.db.export();
      const buffer = Array.from(data);
      localStorage.setItem('ecopulse_sqlite_db', JSON.stringify(buffer));
    } catch (error) {
      console.error('Failed to save database to storage:', error);
    }
  }

  // User operations
  async createUser(userData: { name: string; email?: string; avatar?: string; isAnonymous?: boolean }): Promise<any> {
    await this.initialize();

    if (userData.email) {
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        return existingUser;
      }
    }

    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO users (id, name, email, avatar, createdAt, isAnonymous)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run([id, userData.name, userData.email || null, userData.avatar || null, createdAt, userData.isAnonymous ? 1 : 0]);
    stmt.free();

    this.saveToStorage();

    return {
      id,
      ...userData,
      createdAt: new Date(createdAt),
      isAnonymous: userData.isAnonymous || false
    };
  }

  async getUser(userId: string): Promise<any> {
    await this.initialize();

    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const result = stmt.getAsObject([userId]);
    stmt.free();

    if (result.id) {
      return {
        ...result,
        createdAt: new Date(result.createdAt),
        isAnonymous: Boolean(result.isAnonymous)
      };
    }
    return null;
  }

  async getUserByEmail(email: string): Promise<any> {
    await this.initialize();

    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    const result = stmt.getAsObject([email]);
    stmt.free();

    if (result.id) {
      return {
        ...result,
        createdAt: new Date(result.createdAt),
        isAnonymous: Boolean(result.isAnonymous)
      };
    }
    return null;
  }

  async getAllUsers(): Promise<any[]> {
    await this.initialize();

    const stmt = this.db.prepare('SELECT * FROM users ORDER BY createdAt DESC');
    const results = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        ...row,
        createdAt: new Date(row.createdAt),
        isAnonymous: Boolean(row.isAnonymous)
      });
    }
    stmt.free();
    return results;
  }

  // Commute log operations
  async createCommuteLog(logData: {
    userId: string;
    date: string;
    modes: string[];
    distance?: number;
    duration?: number;
    co2Saved: number;
    notes?: string;
  }): Promise<any> {
    await this.initialize();

    const id = Date.now().toString();
    const createdAt = new Date().toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO commute_logs (id, userId, date, modes, distance, duration, co2Saved, notes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      id,
      logData.userId,
      logData.date,
      JSON.stringify(logData.modes),
      logData.distance || null,
      logData.duration || null,
      logData.co2Saved,
      logData.notes || null,
      createdAt
    ]);
    stmt.free();

    this.saveToStorage();

    return {
      id,
      ...logData,
      createdAt: new Date(createdAt)
    };
  }

  async getCommuteLogs(userId?: string): Promise<any[]> {
    await this.initialize();

    let query = 'SELECT * FROM commute_logs';
    let params: any[] = [];

    if (userId) {
      query += ' WHERE userId = ?';
      params = [userId];
    }

    query += ' ORDER BY createdAt DESC';

    const stmt = this.db.prepare(query);
    const results = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push({
        ...row,
        modes: JSON.parse(row.modes),
        createdAt: new Date(row.createdAt),
        date: row.date
      });
    }
    stmt.free();
    return results;
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<any> {
    await this.initialize();

    const stmt = this.db.prepare('SELECT * FROM user_settings WHERE userId = ?');
    const result = stmt.getAsObject([userId]);
    stmt.free();

    return result.id ? { monthlyGoal: result.monthlyGoal } : { monthlyGoal: 10 };
  }

  async updateUserSettings(userId: string, settings: { monthlyGoal: number }): Promise<void> {
    await this.initialize();

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO user_settings (userId, monthlyGoal)
      VALUES (?, ?)
    `);

    stmt.run([userId, settings.monthlyGoal]);
    stmt.free();

    this.saveToStorage();
  }

  // Community stats operations
  async getCommunityStats(): Promise<any> {
    await this.initialize();

    const stmt = this.db.prepare('SELECT * FROM community_stats WHERE id = 1');
    const result = stmt.getAsObject([]);
    stmt.free();

    return {
      totalUsers: result.totalUsers || 0,
      totalCO2Saved: result.totalCO2Saved || 0,
      totalCO2SavedThisWeek: result.totalCO2SavedThisWeek || 0,
      mostPopularMode: result.mostPopularMode || 'walking',
      totalCommutes: result.totalCommutes || 0
    };
  }

  async updateCommunityStats(stats: any): Promise<void> {
    await this.initialize();

    const stmt = this.db.prepare(`
      UPDATE community_stats SET
        totalUsers = ?,
        totalCO2Saved = ?,
        totalCO2SavedThisWeek = ?,
        mostPopularMode = ?,
        totalCommutes = ?,
        lastUpdated = ?
      WHERE id = 1
    `);

    stmt.run([
      stats.totalUsers,
      stats.totalCO2Saved,
      stats.totalCO2SavedThisWeek,
      stats.mostPopularMode,
      stats.totalCommutes,
      new Date().toISOString()
    ]);
    stmt.free();

    this.saveToStorage();
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    await this.initialize();

    this.db.run('DELETE FROM commute_logs');
    this.db.run('DELETE FROM user_settings');
    this.db.run('DELETE FROM users');
    this.db.run('UPDATE community_stats SET totalUsers = 0, totalCO2Saved = 0, totalCO2SavedThisWeek = 0, totalCommutes = 0 WHERE id = 1');

    this.saveToStorage();
  }

  async exportData(): Promise<string> {
    await this.initialize();
    const data = this.db.export();
    return JSON.stringify(Array.from(data));
  }

  async importData(dataString: string): Promise<void> {
    try {
      const data = new Uint8Array(JSON.parse(dataString));
      this.db = new (await initSqlJs()).Database(data);
      this.isInitialized = true;
      this.saveToStorage();
    } catch (error) {
      console.error('Failed to import database:', error);
      throw error;
    }
  }
}

export default Database;