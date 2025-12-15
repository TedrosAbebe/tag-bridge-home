import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'

// GET - Fetch individual property details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('🏠 INDIVIDUAL PROPERTY API CALLED for ID:', id)
  
  try {
    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      let property = null
      
      // Check if it's an advertiser property (starts with 'adv_')
      if (id.startsWith('adv_')) {
        const advertiserPropertyId = id.replace('adv_', '')
        
        property = db.prepare(`
          SELECT * FROM advertiser_properties 
          WHERE id = ? AND status = 'active'
        `).get(advertiserPropertyId)
        
        if (property) {
          console.log('✅ Found advertiser property:', property.title)
          
          // Format advertiser property for the frontend
          const formattedProperty = {
            id: id,
            title: property.title,
            description: property.description,
            price: property.price,
            currency: property.currency,
            city: property.city,
            area: property.area,
            type: property.property_type,
            bedrooms: property.bedrooms || 3,
            bathrooms: property.bathrooms || 2,
            size: property.size,
            features: property.features ? JSON.parse(property.features) : ['Modern Kitchen', 'Parking Space', 'Security'],
            status: 'approved',
            owner_name: property.advertiser_name,
            owner_role: 'advertiser',
            business_name: property.business_name,
            whatsapp_number: property.whatsapp_number,
            phone_number: property.phone_number,
            email: property.email,
            website: property.website,
            images: property.images ? JSON.parse(property.images) : ['/api/placeholder/400/300'],
            created_at: property.created_at,
            isPremium: Boolean(property.is_premium),
            isFeatured: Boolean(property.is_featured),
            advertiser: {
              name: property.advertiser_name,
              business: property.business_name,
              email: property.email,
              website: property.website
            }
          }

          return NextResponse.json({
            success: true,
            property: formattedProperty
          })
        }
      } else {
        // Regular property lookup
        property = db.prepare(`
          SELECT 
            p.*,
            u.username as owner_name,
            u.role as owner_role
          FROM properties p
          LEFT JOIN users u ON p.owner_id = u.id
          WHERE p.id = ? AND p.status = 'approved'
        `).get(id)
        
        if (property) {
          console.log('✅ Found regular property:', property.title)

          // Format regular property for the frontend
          const formattedProperty = {
            id: property.id,
            title: property.title,
            description: property.description || 'No description available.',
            price: property.price,
            currency: property.currency || 'ETB',
            city: property.city,
            area: property.area,
            type: property.type,
            bedrooms: property.bedrooms || 3,
            bathrooms: property.bathrooms || 2,
            size: property.size,
            features: property.features ? JSON.parse(property.features) : ['Modern Kitchen', 'Parking Space', 'Security'],
            status: property.status,
            owner_name: property.owner_name,
            owner_role: property.owner_role,
            whatsapp_number: property.whatsapp_number,
            phone_number: property.phone_number,
            images: property.images ? JSON.parse(property.images) : ['/api/placeholder/400/300'],
            created_at: property.created_at
          }

          return NextResponse.json({
            success: true,
            property: formattedProperty
          })
        }
      }

      console.log('❌ Property not found or not approved:', id)
      return NextResponse.json({ 
        error: 'Property not found or not approved' 
      }, { status: 404 })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Individual property error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}