const fs = require('fs')
const path = require('path')

console.log('🚀 Setting up Ethiopia Home Broker App...')

// Create data directory if it doesn't exist
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('✅ Created data directory for SQLite database')
}

// Create uploads directory for future image uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('✅ Created uploads directory for property images')
}

// Create .env.local template if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  const envTemplate = `# Ethiopia Home Broker App Environment Variables

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# WhatsApp Business API (replace with your actual WhatsApp business number)
WHATSAPP_CONTACT_PLACEHOLDER=+251911000000

# Bank Account Information (replace with your actual bank details)
BANK_ACCOUNT_PLACEHOLDER="Commercial Bank of Ethiopia - Account: 1000123456789"

# Database URL (SQLite by default)
DATABASE_URL=./data/broker.db

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
`
  
  fs.writeFileSync(envPath, envTemplate)
  console.log('✅ Created .env.local template file')
}

console.log(`
🎉 Setup complete! 

📋 Next steps:
1. Install dependencies: npm install
2. Update placeholders in .env.local:
   - WHATSAPP_CONTACT_PLACEHOLDER: Your WhatsApp business number
   - BANK_ACCOUNT_PLACEHOLDER: Your bank account details
   - JWT_SECRET: A secure random string for production

3. Start the development server: npm run dev

🔐 Default Admin Account:
   Phone: +251911000000
   Password: admin123

📱 Access the admin dashboard at: http://localhost:3000/admin

🏠 Main app at: http://localhost:3000

⚠️  Important: Replace all placeholder values before deploying to production!
`)