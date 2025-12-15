import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'

// GET - Fetch approved properties for public display
export async function GET(request: NextRequest) {
  console.log('🏠 PUBLIC PROPERTIES API CALLED')
  
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      let query = `
        SELECT 
          p.*,
          u.username as owner_name
        FROM properties p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.status = 'approved'
      `
      
      const params: any[] = []
      
      // Add search filters
      if (search) {
        query += ` AND (p.title LIKE ? OR p.area LIKE ? OR p.city LIKE ?)`
        const searchTerm = `%${search}%`
        params.push(searchTerm, searchTerm, searchTerm)
      }
      
      if (type) {
        query += ` AND p.type LIKE ?`
        params.push(`%${type}%`)
      }
      
      if (city) {
        query += ` AND p.city = ?`
        params.push(city)
      }
      
      if (minPrice) {
        query += ` AND p.price >= ?`
        params.push(parseFloat(minPrice))
      }
      
      if (maxPrice) {
        query += ` AND p.price <= ?`
        params.push(parseFloat(maxPrice))
      }
      
      query += ` ORDER BY p.created_at DESC`
      
      console.log('🔍 Query:', query)
      console.log('📝 Params:', params)
      
      const properties = db.prepare(query).all(...params)
      
      console.log('✅ Found', properties.length, 'approved properties')
      
      // Format properties for the frontend
      const formattedProperties = properties.map((prop: any) => ({
        id: prop.id,
        title: prop.title,
        description: prop.description || prop.title,
        price: prop.price,
        currency: prop.currency || 'ETB',
        city: prop.city,
        area: prop.area,
        type: prop.type,
        bedrooms: prop.bedrooms || 3,
        bathrooms: prop.bathrooms || 2,
        size: prop.size,
        features: prop.features ? JSON.parse(prop.features) : [],
        status: prop.status,
        owner_name: prop.owner_name,
        whatsapp_number: prop.whatsapp_number,
        phone_number: prop.phone_number,
        images: prop.images ? JSON.parse(prop.images) : ['/api/placeholder/400/300'],
        created_at: prop.created_at
      }))

      return NextResponse.json({
        success: true,
        properties: formattedProperties
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Public properties error:', error)
    return NextResponse.json({ 
      error: error.message,
      properties: [] 
    }, { status: 500 })
  }
}