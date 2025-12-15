import { NextRequest, NextResponse } from 'next/server'

// GET - Return mock advertiser properties
export async function GET(request: NextRequest) {
  console.log('🏢 Advertiser Properties API called')
  
  try {
    // Mock advertiser properties data
    const mockProperties = [
      {
        id: 'adv_1',
        title: 'Premium Office Space - Bole Atlas',
        description: 'High-end office space in prime location',
        price: 25000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'Bole',
        property_type: 'office',
        bedrooms: null,
        bathrooms: 2,
        size: 120,
        features: ['Air Conditioning', 'Parking', 'Security', 'Elevator'],
        status: 'active',
        advertiser_name: 'Bole Real Estate',
        business_name: 'Bole Properties Ltd',
        whatsapp_number: '+251991856292',
        phone_number: '+251911123456',
        email: 'info@boleproperties.com',
        website: 'www.boleproperties.com',
        images: ['/api/placeholder/400/300'],
        created_at: new Date().toISOString(),
        is_premium: true,
        is_featured: true
      }
    ]

    return NextResponse.json({
      success: true,
      properties: mockProperties
    })

  } catch (error) {
    console.error('❌ Advertiser Properties API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}