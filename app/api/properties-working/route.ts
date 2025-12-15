import { NextRequest, NextResponse } from 'next/server'

// GET - Return mock properties for now (until Supabase is fully set up)
export async function GET(request: NextRequest) {
  console.log('🏠 Properties API called')
  
  try {
    // Mock properties data
    const mockProperties = [
      {
        id: '1',
        title: 'Modern Apartment in Bole',
        description: 'Beautiful 2-bedroom apartment with modern amenities',
        price: 15000,
        currency: 'ETB',
        location: {
          city: 'Addis Ababa',
          area: 'Bole'
        },
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        size: 80,
        images: ['/api/placeholder/400/300'],
        status: 'approved',
        whatsappNumber: '+251991856292',
        phoneNumber: '+251991856292'
      },
      {
        id: '2',
        title: 'Villa in Kazanchis',
        description: 'Spacious villa with garden',
        price: 45000,
        currency: 'ETB',
        location: {
          city: 'Addis Ababa',
          area: 'Kazanchis'
        },
        type: 'villa',
        bedrooms: 4,
        bathrooms: 3,
        size: 200,
        images: ['/api/placeholder/400/300'],
        status: 'approved',
        whatsappNumber: '+251991856292',
        phoneNumber: '+251991856292'
      }
    ]

    return NextResponse.json({
      success: true,
      properties: mockProperties
    })

  } catch (error) {
    console.error('❌ Properties API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}