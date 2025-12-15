const Database = require('better-sqlite3')
const { join } = require('path')

console.log('🏠 CREATING TEST PROPERTY WITH IMAGES')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

try {
  // Create sample base64 image data (small test images)
  const sampleImages = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGY4MWJkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UZXN0IEltYWdlIDE8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UZXN0IEltYWdlIDI8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UZXN0IEltYWdlIDM8L3RleHQ+PC9zdmc+'
  ]

  const propertyId = 'test-prop-with-images-' + Date.now()
  
  // Get admin user ID
  const adminUser = db.prepare('SELECT id FROM users WHERE username = ?').get('tedayeerasu')
  
  if (!adminUser) {
    console.log('❌ Admin user not found')
    return
  }

  console.log('📸 Creating property with 3 test images...')

  const insertProperty = db.prepare(`
    INSERT INTO properties (
      id, title, description, price, currency, city, area, type, 
      bedrooms, bathrooms, size, features, owner_id, whatsapp_number, 
      phone_number, images, status, is_premium, payment_amount, 
      payment_method, payment_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  insertProperty.run(
    propertyId,
    'Beautiful House with Photo Gallery',
    'This is a test property created to demonstrate the photo upload functionality. It includes multiple sample images to test the carousel and gallery features.',
    850000,
    'ETB',
    'Addis Ababa',
    'Bole',
    'house_sale',
    4,
    3,
    250,
    JSON.stringify(['Modern Kitchen', 'Parking', 'Garden', 'Security']),
    adminUser.id,
    '0991856292',
    '0991856292',
    JSON.stringify(sampleImages),
    'approved', // Make it approved so it shows on homepage
    0,
    50,
    'cbe',
    'confirmed'
  )

  console.log('✅ Test property created successfully!')
  console.log(`   ID: ${propertyId}`)
  console.log(`   Title: Beautiful House with Photo Gallery`)
  console.log(`   Images: ${sampleImages.length} photos`)
  console.log(`   Status: approved`)

  // Verify the property was created
  const createdProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyId)
  
  if (createdProperty) {
    console.log('\n🔍 VERIFICATION:')
    console.log(`   Property exists: ✅`)
    console.log(`   Has images: ${createdProperty.images ? '✅' : '❌'}`)
    
    if (createdProperty.images) {
      try {
        const images = JSON.parse(createdProperty.images)
        console.log(`   Images count: ${images.length}`)
        console.log(`   First image preview: ${images[0].substring(0, 50)}...`)
      } catch (e) {
        console.log(`   Images parsing error: ${e.message}`)
      }
    }
  }

} catch (error) {
  console.error('❌ Error creating test property:', error)
} finally {
  db.close()
}

console.log('\n🏁 Test property creation complete!')
console.log('💡 Now refresh the homepage to see the property with images!')