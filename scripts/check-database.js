const fs = require('fs')
const path = require('path')

console.log('🔍 CHECKING DATABASE SETUP...\n')

// Check if data directory exists
const dataDir = path.join(process.cwd(), 'data')
console.log('📁 Data directory path:', dataDir)

if (!fs.existsSync(dataDir)) {
    console.log('❌ Data directory does not exist')
    console.log('📁 Creating data directory...')
    try {
        fs.mkdirSync(dataDir, { recursive: true })
        console.log('✅ Data directory created successfully')
    } catch (error) {
        console.error('❌ Failed to create data directory:', error.message)
        process.exit(1)
    }
} else {
    console.log('✅ Data directory exists')
}

// Check if database file exists
const dbPath = path.join(dataDir, 'broker.db')
console.log('🗄️ Database file path:', dbPath)

if (fs.existsSync(dbPath)) {
    console.log('✅ Database file exists')
    const stats = fs.statSync(dbPath)
    console.log('📊 Database file size:', stats.size, 'bytes')
    console.log('📅 Database created:', stats.birthtime)
    console.log('📅 Database modified:', stats.mtime)
} else {
    console.log('❌ Database file does not exist')
    console.log('💡 It will be created when the app starts')
}

// Check permissions
try {
    fs.accessSync(dataDir, fs.constants.R_OK | fs.constants.W_OK)
    console.log('✅ Data directory has read/write permissions')
} catch (error) {
    console.error('❌ Permission error for data directory:', error.message)
}

console.log('\n💡 TROUBLESHOOTING TIPS:')
console.log('========================')
console.log('1. Make sure the server is running: npm run dev')
console.log('2. Check server console for database initialization logs')
console.log('3. Try restarting the server to reinitialize database')
console.log('4. Check if antivirus is blocking database file creation')
console.log('5. Make sure you have write permissions in the project directory')

console.log('\n🧪 NEXT STEPS:')
console.log('==============')
console.log('1. Start your server: npm run dev')
console.log('2. Open: test-registration.html in your browser')
console.log('3. Try registering a test user')
console.log('4. Check both browser and server console for detailed logs')