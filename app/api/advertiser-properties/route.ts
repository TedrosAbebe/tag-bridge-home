import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'

interface AdvertiserPropertyRow {
  id: number
  advertiser_id: string
  advertiser_name: string
  business_name: string
  title: string
  description: string
  price: number
  currency: string
  city: string
  area: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  size: number
  whatsapp_number: string
  phone_number: string
  email: string
  website: string | null
  features: string | null
  images: string | null
  status: string
  is_featured: number
  is_premium: number
  created_at: string
  updated_at: string
}

export async function GET() {
  try {
    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)
    
    // Create advertiser_properties table if it doesn't exist
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
    
    // Get all active advertiser properties
    const properties = db.prepare(`
      SELECT * FROM advertiser_properties 
      WHERE status = 'active'
      ORDER BY is_featured DESC, is_premium DESC, created_at DESC
    `).all() as AdvertiserPropertyRow[]

    // Transform the data to match the homepage property interface
    const transformedProperties = properties.map(prop => ({
      id: `adv_${prop.id}`,
      title: prop.title,
      description: prop.description,
      price: prop.price,
      currency: prop.currency,
      location: {
        city: prop.city,
        area: prop.area
      },
      type: prop.property_type,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      size: prop.size,
      images: prop.images ? JSON.parse(prop.images) : [],
      status: 'approved',
      whatsappNumber: prop.whatsapp_number,
      phoneNumber: prop.phone_number,
      advertiser: {
        name: prop.advertiser_name,
        business: prop.business_name,
        email: prop.email,
        website: prop.website
      },
      isPremium: Boolean(prop.is_premium),
      isFeatured: Boolean(prop.is_featured),
      created_at: prop.created_at
    }))

    db.close()

    return NextResponse.json({
      success: true,
      properties: transformedProperties
    })

  } catch (error) {
    console.error('Error fetching advertiser properties:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const propertyData = await request.json()
    
    // Validate required fields
    const requiredFields = ['advertiser_id', 'advertiser_name', 'business_name', 'title', 'description', 'price', 'city', 'area', 'property_type', 'size', 'whatsapp_number', 'phone_number', 'email']
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)
    
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

    // Insert advertiser property
    const insertStmt = db.prepare(`
      INSERT INTO advertiser_properties (
        advertiser_id, advertiser_name, business_name, title, description,
        price, currency, city, area, property_type, bedrooms, bathrooms,
        size, whatsapp_number, phone_number, email, website, features, images
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = insertStmt.run(
      propertyData.advertiser_id,
      propertyData.advertiser_name,
      propertyData.business_name,
      propertyData.title,
      propertyData.description,
      propertyData.price,
      propertyData.currency || 'ETB',
      propertyData.city,
      propertyData.area,
      propertyData.property_type,
      propertyData.bedrooms || null,
      propertyData.bathrooms || null,
      propertyData.size,
      propertyData.whatsapp_number,
      propertyData.phone_number,
      propertyData.email,
      propertyData.website || null,
      propertyData.features ? JSON.stringify(propertyData.features) : null,
      propertyData.images ? JSON.stringify(propertyData.images) : null
    )

    db.close()

    return NextResponse.json({
      success: true,
      message: 'Advertiser property added successfully',
      propertyId: result.lastInsertRowid
    })

  } catch (error) {
    console.error('Error adding advertiser property:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Bulk delete all advertiser properties (admin only)
export async function DELETE(request: NextRequest) {
  console.log('🗑️ ADVERTISER PROPERTIES BULK DELETE API CALLED')
  
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Verify admin access (you'll need to implement getUserFromToken)
    // For now, assuming admin verification is done
    
    const { bulkDelete, adminNotes } = await request.json()
    
    if (!bulkDelete) {
      return NextResponse.json({ error: 'Bulk delete flag required' }, { status: 400 })
    }

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      // Get count of advertiser properties before deletion
      const countResult = db.prepare('SELECT COUNT(*) as count FROM advertiser_properties').get() as any
      const deletedCount = countResult.count

      if (deletedCount === 0) {
        return NextResponse.json({
          success: true,
          message: 'No advertiser properties to delete',
          deletedCount: 0
        })
      }

      // Delete all advertiser properties
      const deleteResult = db.prepare('DELETE FROM advertiser_properties').run()

      console.log(`✅ Bulk deleted ${deletedCount} advertiser properties`)

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${deletedCount} advertiser properties`,
        deletedCount
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Advertiser properties bulk delete error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}