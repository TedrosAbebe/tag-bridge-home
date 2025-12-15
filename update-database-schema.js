const Database = require('better-sqlite3');
const { join } = require('path');

const dbPath = join(process.cwd(), 'data', 'broker.db');

console.log('🔄 Updating database schema to support broker role...\n');

try {
    const db = new Database(dbPath);
    
    // Get current users
    console.log('📊 Backing up current users...');
    const users = db.prepare('SELECT * FROM users').all();
    console.log(`   Found ${users.length} users to backup`);
    
    // Drop the old table
    console.log('🗑️ Dropping old users table...');
    db.exec('DROP TABLE IF EXISTS users');
    
    // Create new table with broker role support
    console.log('🏗️ Creating new users table with broker role...');
    db.exec(`
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'broker', 'user')) DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // Restore users
    console.log('📥 Restoring users...');
    const insertUser = db.prepare(`
        INSERT INTO users (id, username, password_hash, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    for (const user of users) {
        insertUser.run(
            user.id,
            user.username,
            user.password_hash,
            user.role,
            user.created_at,
            user.updated_at
        );
        console.log(`   ✅ Restored user: ${user.username} (${user.role})`);
    }
    
    db.close();
    console.log('\n✅ Database schema updated successfully!');
    console.log('   Now supports roles: admin, broker, user');
    
} catch (error) {
    console.error('❌ Error updating database schema:', error);
}