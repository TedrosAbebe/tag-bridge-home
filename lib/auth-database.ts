import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize minimal database for authentication only
export function initializeAuthDatabase() {
  // Single users table for both admin and regular users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'broker', 'user')) DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // System configuration table to track admin setup
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Broker information table
  db.exec(`
    CREATE TABLE IF NOT EXISTS broker_info (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      license_number TEXT,
      experience TEXT NOT NULL,
      specialization TEXT NOT NULL,
      status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `)
}

// User operations (for both admin and regular users)
export const userOperations = {
  db: db, // Expose database for complex operations
  
  create: db.prepare(`
    INSERT INTO users (id, username, password_hash, role)
    VALUES (?, ?, ?, ?)
  `),
  
  findByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
  findById: db.prepare('SELECT * FROM users WHERE id = ?'),
  
  updateLastLogin: db.prepare(`
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  update: db.prepare(`
    UPDATE users SET username = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  updatePassword: db.prepare(`
    UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  delete: db.prepare('DELETE FROM users WHERE id = ?'),
  
  getAll: db.prepare('SELECT * FROM users ORDER BY created_at DESC')
}

// Broker operations
export const brokerOperations = {
  db: db, // Expose database for complex operations
  
  create: db.prepare(`
    INSERT INTO broker_info (id, user_id, full_name, email, phone, license_number, experience, specialization)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  findByUserId: db.prepare('SELECT * FROM broker_info WHERE user_id = ?'),
  
  updateStatus: db.prepare(`
    UPDATE broker_info SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?
  `),
  
  delete: db.prepare('DELETE FROM broker_info WHERE user_id = ?'),
  
  deleteById: db.prepare('DELETE FROM broker_info WHERE id = ?'),
  
  getAll: db.prepare(`
    SELECT bi.*, u.username, u.created_at as user_created_at 
    FROM broker_info bi 
    JOIN users u ON bi.user_id = u.id 
    ORDER BY bi.created_at DESC
  `),
  
  getPending: db.prepare(`
    SELECT bi.*, u.username, u.created_at as user_created_at 
    FROM broker_info bi 
    JOIN users u ON bi.user_id = u.id 
    WHERE bi.status = 'pending'
    ORDER BY bi.created_at DESC
  `),
  
  getRejected: db.prepare(`
    SELECT bi.*, u.username, u.created_at as user_created_at 
    FROM broker_info bi 
    JOIN users u ON bi.user_id = u.id 
    WHERE bi.status = 'rejected'
    ORDER BY bi.created_at DESC
  `)
}

// System configuration operations
export const systemConfig = {
  set: db.prepare(`
    INSERT OR REPLACE INTO system_config (key, value, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `),
  
  get: db.prepare('SELECT value FROM system_config WHERE key = ?'),
  
  exists: db.prepare('SELECT 1 FROM system_config WHERE key = ?'),
  
  // Check if admin setup is complete
  isAdminSetupComplete: () => {
    const result = systemConfig.get.get('admin_setup_complete') as { value: string } | undefined
    return result?.value === 'true'
  },
  
  // Mark admin setup as complete
  markAdminSetupComplete: () => {
    systemConfig.set.run('admin_setup_complete', 'true')
  },
  
  // Check if any admin exists
  hasAdminUser: () => {
    const result = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "admin"').get() as { count: number }
    return result.count > 0
  }
}

// Initialize database on import
initializeAuthDatabase()

export default db