import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd get the user ID from the session/JWT
    // For now, we'll return sample data
    
    const sampleProperties = [
      {
        id: '1',
        title: 'Luxury Villa in Bole',
        description: 'Beautiful 4-bedroom villa with modern amenities',
        price: 2500000,
        currency: 'ETB',
        location: {
          city: 'Addis Ababa',
          area: 'Bole'
        },
        type: 'villa_sale',
        bedrooms: 4,
        bathrooms: 3,
        size: 350,
        images: [],
        status: 'approved',
        whatsappNumber: '+251911123456',
        phoneNumber: '+251911123456',
        created_at: '2024-01-15',
        views: 245,
        inquiries: 12
      },
      {
        id: '2',
        title: 'Modern Apartment for Rent',
        description: 'Spacious 2-bedroom apartment in prime location',
        price: 15000,
        currency: 'ETB',
        location: {
          city: 'Addis Ababa',
          area: 'Piazza'
        },
        type: 'apartment_rent',
        bedrooms: 2,
        bathrooms: 2,
        size: 120,
        images: [],
        status: 'pending',
        whatsappNumber: '+251911123456',
        phoneNumber: '+251911123456',
        created_at: '2024-01-20',
        views: 89,
        inquiries: 5
      }
    ]

    return NextResponse.json({
      success: true,
      properties: sampleProperties
    })

  } catch (error) {
    console.error('Error fetching advertiser properties:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}