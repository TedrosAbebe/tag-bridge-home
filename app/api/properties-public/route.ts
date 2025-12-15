import { NextRequest, NextResponse } from 'next/server'
import { propertyOperations } from '../../../lib/supabase-database'

// GET - Fetch approved properties for public display
export async function GET(request: NextRequest) {
  try {
    console.log('🏠 PUBLIC PROPERTIES API CALLED')
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    // Get approved properties from Supabase
    const properties = await propertyOperations.getApproved()

    // Apply client-side filtering (in a real app, this should be done in the database query)
    let filteredProperties = properties

    if (city) {
      filteredProperties = filteredProperties.filter(p => 
        p.city?.toLowerCase().includes(city.toLowerCase())
      )
    }

    if (type) {
      filteredProperties = filteredProperties.filter(p => 
        p.property_type?.toLowerCase() === type.toLowerCase()
      )
    }

    if (minPrice) {
      filteredProperties = filteredProperties.filter(p => 
        p.price >= parseInt(minPrice)
      )
    }

    if (maxPrice) {
      filteredProperties = filteredProperties.filter(p => 
        p.price <= parseInt(maxPrice)
      )
    }

    console.log(`✅ Found ${filteredProperties.length} approved properties`)

    return NextResponse.json({
      success: true,
      properties: filteredProperties,
      total: filteredProperties.length
    })

  } catch (error) {
    console.error('❌ Public properties API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}