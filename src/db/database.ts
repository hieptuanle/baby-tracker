import Database from 'better-sqlite3';
import * as crypto from 'crypto';

const db = new Database('baby-tracker.db');
db.pragma('journal_mode = WAL');

const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pregnancies table
CREATE TABLE IF NOT EXISTS pregnancies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  expected_delivery_date DATE NOT NULL,
  last_menstrual_period DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
`;

db.exec(schema);

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface Pregnancy {
  id: number;
  user_id: number;
  expected_delivery_date: string;
  last_menstrual_period?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

export const userModel = {
  create: (username: string, passwordHash: string) => {
    const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    const result = stmt.run(username, passwordHash);
    return result.lastInsertRowid as number;
  },

  findByUsername: (username: string): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
  },

  findById: (id: number): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | undefined;
  }
};

export const pregnancyModel = {
  create: (userId: number, expectedDeliveryDate: string, lastMenstrualPeriod?: string) => {
    const stmt = db.prepare(
      'INSERT INTO pregnancies (user_id, expected_delivery_date, last_menstrual_period) VALUES (?, ?, ?)'
    );
    const result = stmt.run(userId, expectedDeliveryDate, lastMenstrualPeriod || null);
    return result.lastInsertRowid as number;
  },

  findByUserId: (userId: number): Pregnancy | undefined => {
    const stmt = db.prepare('SELECT * FROM pregnancies WHERE user_id = ? ORDER BY created_at DESC LIMIT 1');
    return stmt.get(userId) as Pregnancy | undefined;
  },

  update: (id: number, expectedDeliveryDate: string, lastMenstrualPeriod?: string) => {
    const stmt = db.prepare(
      'UPDATE pregnancies SET expected_delivery_date = ?, last_menstrual_period = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    return stmt.run(expectedDeliveryDate, lastMenstrualPeriod || null, id);
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM pregnancies WHERE id = ?');
    return stmt.run(id);
  }
};

export const sessionModel = {
  create: (userId: number): string => {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const stmt = db.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)');
    stmt.run(userId, token, expiresAt.toISOString());
    return token;
  },

  findByToken: (token: string): Session | undefined => {
    const stmt = db.prepare("SELECT * FROM sessions WHERE token = ? AND expires_at > datetime('now')");
    return stmt.get(token) as Session | undefined;
  },

  delete: (token: string) => {
    const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
    return stmt.run(token);
  },

  deleteExpired: () => {
    const stmt = db.prepare("DELETE FROM sessions WHERE expires_at <= datetime('now')");
    return stmt.run();
  }
};

export default db;