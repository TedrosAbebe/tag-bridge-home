const Database = require('better-sqlite3')
const { join } = require('path')

console.log('🔍 VERIFYING DATA STRUCTURE MATCH')

const dbPath = join(process.cwd(), 'data', 'broker.db')
const db = new Database(dbPath)

try {
  // Get the exact query from the API
  const properties = db.prepare(`
    SELECT 
      p.*,
      u.username as owner_name,
      u.role as owner_role
    FROM properties p
    LEFT JOIN users u ON p.owner_id = u.id
    WHERE p.status = 'approved'
    ORDER BY p.is_premium DESC, p.created_at DESC
    LIMIT 50
  `).all()

  console.log(`\n📊 Found ${properties.length} properties`)

  // Simulate the exact API formatting
  const formattedProperties = properties.map((prop) => {
    const formatted = {
      id: prop.id,
      title: prop.title,
      description: prop.description || 'No description available',
      price: prop.price,
      currency: prop.currency || 'ETB',
      location: {
        city: prop.city,
        area: prop.area
      },
      type: prop.type,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      size: prop.size,
      images: prop.images ? JSON.parse(prop.images) : ['/api/placeholder/400/300'],
      features: prop.features ? JSON.parse(prop.features) : [],
      status: prop.status,
      whatsappNumber: prop.whatsapp_number,
      phoneNumber: prop.phone_number,
      owner_name: prop.owner_name,
      owner_role: prop.owner_role,
      isPremium: Boolean(prop.is_premium),
      created_at: prop.created_at
    }
    
    console.log(`\n🏠 ${formatted.title}:`)
    console.log(`   Images: ${formatted.images.length} items`)
    console.log(`   First image: ${formatted.images[0].substring(0, 80)}...`)
    console.log(`   Is placeholder: ${formatted.images[0].includes('placeholder')}`)
    console.log(`   Is base64: ${formatted.images[0].startsWith('data:')}`)
    
    return formatted
  })

  // Check for properties with real images
  const propertiesWithRealImages = formattedProperties.filter(p => 
    p.images.length > 0 && !p.images[0].includes('placeholder')
  )

  console.log(`\n📸 SUMMARY:`)
  console.log(`   Total properties: ${formattedProperties.length}`)
  console.log(`   Properties with real images: ${propertiesWithRealImages.length}`)
  console.log(`   Properties with placeholders: ${formattedProperties.filter(p => p.images[0].includes('placeholder')).length}`)

  if (propertiesWithRealImages.length > 0) {
    console.log(`\n✅ PROPERTIES WITH REAL IMAGES:`)
    propertiesWithRealImages.forEach(p => {
      console.log(`   - ${p.title} (${p.images.length} images)`)
    })
  } else {
    console.log(`\n❌ NO PROPERTIES WITH REAL IMAGES FOUND`)
  }

  // Test the API response structure
  const apiResponse = {
    success: true,
    properties: formattedProperties
  }

  console.log(`\n🔍 API RESPONSE STRUCTURE:`)
  console.log(`   success: ${apiResponse.success}`)
  console.log(`   properties: Array(${apiResponse.properties.length})`)
  console.log(`   First property keys: ${Object.keys(apiResponse.properties[0] || {}).join(', ')}`)

} catch (error) {
  console.error('❌ Verification error:', error)
} finally {
  db.close()
}

console.log('\n🏁 Verification complete!')