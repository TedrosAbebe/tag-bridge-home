import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'data', 'enhanced-broker.db')
const db = new Database(dbPath)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Initialize enhanced database schema based on your requirements
export function initializeEnhancedDatabase() {
  // Users table (enhanced with email, phone, whatsapp)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'broker', 'user')) DEFAULT 'user',
      whatsapp_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Properties table (complete schema)
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      broker_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'ETB',
      city TEXT NOT NULL,
      area TEXT NOT NULL,
      address TEXT,
      type TEXT NOT NULL,
      bedrooms INTEGER,
      bathrooms INTEGER,
      size REAL,
      features TEXT, -- JSON string of features array
      images TEXT, -- JSON string of images array
      status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'sold')) DEFAULT 'pending',
      rejection_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (broker_id) REFERENCES users(id)
    )
  `)

  // Admin OTP table (for enhanced admin login)
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_otp (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      otp TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Notifications table (for broker notifications)
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      property_id TEXT,
      is_read BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (property_id) REFERENCES properties(id)
    )
  `)

  console.log('✅ Enhanced database schema initialized')
}

// Enhanced user operations
export const enhancedUserOperations = {
  create: db.prepare(`
    INSERT INTO users (id, username, email, phone, password_hash, role, whatsapp_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),
  
  findByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
  findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  findById: db.prepare('SELECT * FROM users WHERE id = ?'),
  
  updateLastLogin: db.prepare(`
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  update: db.prepare(`
    UPDATE users SET username = ?, email = ?, phone = ?, role = ?, whatsapp_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  delete: db.prepare('DELETE FROM users WHERE id = ?'),
  getAll: db.prepare('SELECT * FROM users ORDER BY created_at DESC')
}

// Property operations
export const propertyOperations = {
  create: db.prepare(`
    INSERT INTO properties (id, broker_id, title, description, price, currency, city, area, address, type, bedrooms, bathrooms, size, features, images, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  
  findById: db.prepare('SELECT * FROM properties WHERE id = ?'),
  findByBroker: db.prepare('SELECT * FROM properties WHERE broker_id = ? ORDER BY created_at DESC'),
  getAll: db.prepare('SELECT * FROM properties ORDER BY created_at DESC'),
  getApproved: db.prepare('SELECT * FROM properties WHERE status = "approved" ORDER BY created_at DESC'),
  
  updateStatus: db.prepare(`
    UPDATE properties SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  update: db.prepare(`
    UPDATE properties SET title = ?, description = ?, price = ?, currency = ?, city = ?, area = ?, address = ?, type = ?, bedrooms = ?, bathrooms = ?, size = ?, features = ?, images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
  `),
  
  delete: db.prepare('DELETE FROM properties WHERE id = ?'),
  
  search: db.prepare(`
    SELECT * FROM properties 
    WHERE status = 'approved' 
    AND (? IS NULL OR city LIKE '%' || ? || '%')
    AND (? IS NULL OR area LIKE '%' || ? || '%')
    AND (? IS NULL OR type = ?)
    AND (? IS NULL OR price >= ?)
    AND (? IS NULL OR price <= ?)
    ORDER BY created_at DESC
  `)
}

// OTP operations
export const otpOperations = {
  create: db.prepare(`
    INSERT INTO admin_otp (id, email, otp, expires_at)
    VALUES (?, ?, ?, ?)
  `),
  
  findByEmail: db.prepare('SELECT * FROM admin_otp WHERE email = ? AND expires_at > datetime("now") ORDER BY created_at DESC LIMIT 1'),
  
  delete: db.prepare('DELETE FROM admin_otp WHERE email = ?'),
  
  cleanup: db.prepare('DELETE FROM admin_otp WHERE expires_at <= datetime("now")')
}

// Notification operations
export const notificationOperations = {
  create: db.prepare(`
    INSERT INTO notifications (id, user_id, type, title, message, property_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `),
  
  findByUser: db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC'),
  findUnreadByUser: db.prepare('SELECT * FROM notifications WHERE user_id = ? AND is_read = FALSE ORDER BY created_at DESC'),
  
  markAsRead: db.prepare('UPDATE notifications SET is_read = TRUE WHERE id = ?'),
  markAllAsRead: db.prepare('UPDATE notifications SET is_read = TRUE WHERE user_id = ?'),
  
  delete: db.prepare('DELETE FROM notifications WHERE id = ?')
}

// Initialize database on import
initializeEnhancedDatabase()

export default db