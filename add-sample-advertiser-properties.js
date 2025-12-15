const Database = require('better-sqlite3')
const { join } = require('path')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

console.log('🏢 Adding sample advertiser properties...')

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS advertiser_properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    advertiser_id TEXT NOT NULL,
    advertiser_name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT DEFAULT 'ETB',
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    property_type TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    size REAL NOT NULL,
    whatsapp_number TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    website TEXT,
    features TEXT,
    images TEXT,
    status TEXT DEFAULT 'active',
    is_featured BOOLEAN DEFAULT 1,
    is_premium BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

const sampleProperties = [
  {
    advertiser_id: 'advertiser_1',
    advertiser_name: 'Tedros Abebe',
    business_name: 'ABC Real Estate',
    title: 'Luxury Villa in Bole - Premium Location',
    description: 'Stunning 4-bedroom villa with modern amenities, swimming pool, and garden. Perfect for families seeking luxury living in the heart of Addis Ababa.',
    price: 3500000,
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'Bole',
    property_type: 'villa_sale',
    bedrooms: 4,
    bathrooms: 3,
    size: 400,
    whatsapp_number: '0991856292',
    phone_number: '0991856292',
    email: 'tedayeerasu@gmail.com',
    website: null,
    features: JSON.stringify(['Swimming Pool', 'Garden', 'Parking', 'Security', 'Modern Kitchen']),
    images: JSON.stringify([])
  },
  {
    advertiser_id: 'advertiser_1',
    advertiser_name: 'Tedros Abebe',
    business_name: 'ABC Real Estate',
    title: 'Modern Apartment for Rent - Furnished',
    description: 'Fully furnished 2-bedroom apartment in prime location. Includes all utilities, high-speed internet, and 24/7 security.',
    price: 25000,
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'Kazanchis',
    property_type: 'apartment_rent',
    bedrooms: 2,
    bathrooms: 2,
    size: 120,
    whatsapp_number: '0991856292',
    phone_number: '0991856292',
    email: 'tedayeerasu@gmail.com',
    website: null,
    features: JSON.stringify(['Furnished', 'Internet', 'Security', 'Utilities Included']),
    images: JSON.stringify([])
  },
  {
    advertiser_id: 'advertiser_2',
    advertiser_name: 'John Doe',
    business_name: 'Doe Real Estate',
    title: 'Commercial Office Space - Business District',
    description: 'Premium office space in the heart of business district. Perfect for corporate offices, startups, and professional services.',
    price: 150000,
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'Piazza',
    property_type: 'shop_rent',
    bedrooms: null,
    bathrooms: 2,
    size: 200,
    whatsapp_number: '+251911123456',
    phone_number: '+251911123456',
    email: 'john.doe@example.com',
    website: 'https://www.doerealestate.com',
    features: JSON.stringify(['Air Conditioning', 'Elevator', 'Parking', 'Conference Room']),
    images: JSON.stringify([])
  },
  {
    advertiser_id: 'advertiser_1',
    advertiser_name: 'Tedros Abebe',
    business_name: 'ABC Real Estate',
    title: 'Family House with Garden - Quiet Neighborhood',
    description: 'Beautiful 3-bedroom house in quiet residential area. Large garden, garage, and close to schools and shopping centers.',
    price: 2200000,
    currency: 'ETB',
    city: 'Addis Ababa',
    area: 'CMC',
    property_type: 'house_sale',
    bedrooms: 3,
    bathrooms: 2,
    size: 250,
    whatsapp_number: '0991856292',
    phone_number: '0991856292',
    email: 'tedayeerasu@gmail.com',
    website: null,
    features: JSON.stringify(['Garden', 'Garage', 'Near Schools', 'Quiet Area']),
    images: JSON.stringify([])
  }
]

const insertStmt = db.prepare(`
  INSERT INTO advertiser_properties (
    advertiser_id, advertiser_name, business_name, title, description,
    price, currency, city, area, property_type, bedrooms, bathrooms,
    size, whatsapp_number, phone_number, email, website, features, images
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

sampleProperties.forEach((property, index) => {
  try {
    const result = insertStmt.run(
      property.advertiser_id,
      property.advertiser_name,
      property.business_name,
      property.title,
      property.description,
      property.price,
      property.currency,
      property.city,
      property.area,
      property.property_type,
      property.bedrooms,
      property.bathrooms,
      property.size,
      property.whatsapp_number,
      property.phone_number,
      property.email,
      property.website,
      property.features,
      property.images
    )
    
    console.log(`✅ Added property ${index + 1}: ${property.title} (ID: ${result.lastInsertRowid})`)
  } catch (error) {
    console.error(`❌ Error adding property ${index + 1}:`, error.message)
  }
})

// Check what was added
const allProperties = db.prepare('SELECT * FROM advertiser_properties').all()
console.log(`\n📊 Total advertiser properties in database: ${allProperties.length}`)

allProperties.forEach((prop, index) => {
  console.log(`${index + 1}. ${prop.title} - ${prop.price} ${prop.currency} (${prop.business_name})`)
})

db.close()
console.log('\n🎉 Sample advertiser properties added successfully!')