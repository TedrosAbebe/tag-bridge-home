// lib/database.ts (clean temporary file)
/*
  Clean database initializer with DATABASE_URL guard.
*/
/* eslint-disable @typescript-eslint/no-var-requires */
const DATABASE_URL = process.env.DATABASE_URL

export const isRemoteDb = Boolean(DATABASE_URL)

export let db: any = null
export let userOperations: any = {}
export let propertyOperations: any = {}
export let paymentOperations: any = {}
export let favoriteOperations: any = {}
export let imageOperations: any = {}
export let settingsOperations: any = {}
export let adminLogOperations: any = {}
export let whatsappOperations: any = {}
export let initializeDatabase: (() => void) | null = null

if (isRemoteDb) {
  // eslint-disable-next-line no-console
  console.warn('[lib/database] DATABASE_URL detected — skipping local SQLite initialization.')
  const makeStub = (name: string) => new Proxy({}, { get() { return () => { throw new Error(`[lib/database] ${name} called while DATABASE_URL is set. Implement a remote DB adapter for production.`) } } })
  userOperations = makeStub('userOperations')
  propertyOperations = makeStub('propertyOperations')
  paymentOperations = makeStub('paymentOperations')
  initializeDatabase = () => { throw new Error('initializeDatabase unavailable when DATABASE_URL is set') }
} else {
  const Database = require('better-sqlite3')
  const path = require('path')
  const fs = require('fs')
  const bcrypt = require('bcryptjs')
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  const dbFile = path.join(dataDir, 'broker.db')
  db = new Database(dbFile)
  db.pragma('foreign_keys = ON')
  db.exec(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT DEFAULT 'user', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.exec(`CREATE TABLE IF NOT EXISTS properties (id TEXT PRIMARY KEY, title TEXT, description TEXT, price REAL, status TEXT, owner_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.exec(`CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, property_id TEXT, user_id TEXT, amount REAL, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.exec(`CREATE TABLE IF NOT EXISTS property_images (id TEXT PRIMARY KEY, property_id TEXT, image_url TEXT, is_primary INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.exec(`CREATE TABLE IF NOT EXISTS favorites (id TEXT PRIMARY KEY, user_id TEXT, property_id TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.exec(`CREATE TABLE IF NOT EXISTS system_settings (key TEXT PRIMARY KEY, value TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  db.exec(`CREATE TABLE IF NOT EXISTS whatsapp_confirmations (id TEXT PRIMARY KEY, payment_id TEXT, sender_number TEXT, message_content TEXT, received_at DATETIME DEFAULT CURRENT_TIMESTAMP, processed INTEGER DEFAULT 0)`)
  db.exec(`CREATE TABLE IF NOT EXISTS admin_logs (id TEXT PRIMARY KEY, admin_id TEXT, action TEXT, target_type TEXT, target_id TEXT, details TEXT, ip_address TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`)
  userOperations = {
    create: db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)'),
    findByUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
    findById: db.prepare('SELECT * FROM users WHERE id = ?')
  }
  propertyOperations = {
    create: db.prepare('INSERT INTO properties (id, title, description, price, status, owner_id) VALUES (?, ?, ?, ?, ?, ?)'),
    getById: db.prepare('SELECT * FROM properties WHERE id = ?'),
    listAll: db.prepare('SELECT * FROM properties')
  }
  paymentOperations = {
    create: db.prepare('INSERT INTO payments (id, property_id, user_id, amount, status) VALUES (?, ?, ?, ?, ?)'),
    findById: db.prepare('SELECT * FROM payments WHERE id = ?'),
    updateStatus: db.prepare('UPDATE payments SET status = ? WHERE id = ?')
  }

  // Additional operations used in the codebase
  export const favoriteOperations = {
    add: db.prepare('INSERT OR IGNORE INTO favorites (id, user_id, property_id) VALUES (?, ?, ?)'),
    remove: db.prepare('DELETE FROM favorites WHERE user_id = ? AND property_id = ?'),
    checkExists: db.prepare('SELECT id FROM favorites WHERE user_id = ? AND property_id = ? LIMIT 1')
  }

  export const imageOperations = {
    add: db.prepare('INSERT INTO property_images (id, property_id, image_url, is_primary) VALUES (?, ?, ?, ?)'),
    getByProperty: db.prepare('SELECT * FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, created_at ASC'),
    delete: db.prepare('DELETE FROM property_images WHERE id = ?')
  }

  export const settingsOperations = {
    get: db.prepare('SELECT value FROM system_settings WHERE key = ?'),
    set: db.prepare('INSERT OR REPLACE INTO system_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)')
  }

  export const adminLogOperations = {
    create: db.prepare('INSERT INTO admin_logs (id, admin_id, action, target_type, target_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)')
  }

  export const whatsappOperations = {
    addConfirmation: db.prepare('INSERT INTO whatsapp_confirmations (id, payment_id, sender_number, message_content) VALUES (?, ?, ?, ?)'),
    markProcessed: db.prepare('UPDATE whatsapp_confirmations SET processed = 1 WHERE id = ?')
  }
  initializeDatabase = () => {
    const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ? LIMIT 1').get('admin')
    if (!existingAdmin) {
      const adminId = 'admin-' + Date.now()
      const hashed = bcrypt.hashSync('admin123', 12)
      db.prepare('INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)').run(adminId, 'admin', hashed, 'admin')
      console.log('[lib/database] Default admin created: username=admin password=admin123')
    }
  }
  try { initializeDatabase() } catch (err) { console.error('[lib/database] init error', err) }
  console.log('[lib/database] Initialized local SQLite at', dbFile)
}

export default db
