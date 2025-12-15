import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch individual property details (using mock data temporarily)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('🏠 INDIVIDUAL PROPERTY API CALLED for ID:', id)
  
  try {
    // Mock properties database
    const mockProperties = {
      '1': {
        id: '1',
        title: 'Modern Apartment in Bole',
        description: 'Beautiful 2-bedroom apartment with modern amenities in the heart of Bole. Features include a spacious living room, modern kitchen with appliances, two comfortable bedrooms, and a balcony with city views. Located near shopping centers, restaurants, and public transportation.',
        price: 15000,
        currency: 'ETB',
        location: {
          city: 'Addis Ababa',
          area: 'Bole'
        },
        type: 'apartment_rent',
        bedrooms: 2,
        bathrooms: 1,
        size: 80,
        features: ['Modern Kitchen', 'Balcony', 'Security', 'Parking', 'Furnished'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
        status: 'approved',
        whatsappNumber: '+251991856292',
        phoneNumber: '+251991856292',
        owner: {
          name: 'Ahmed Hassan',
          role: 'broker',
          phone: '+251991856292',
          whatsapp: '+251991856292'
        },
        created_at: new Date().toISOString(),
        isPremium: false,
        isFeatured: false
      },
      '2': {
        id: '2',
        title: 'Villa in Kazanchis',
        description: 'Spacious 4-bedroom villa with garden in prestigious Kazanchis area. This elegant property features a large living area, dining room, modern kitchen, four bedrooms with built-in wardrobes, three bathrooms, and a beautiful garden. Perfect for families looking for luxury and comfort.',
        price: 45000,
        currency: 'ETB',
        location: {
          city: 'Addis Ababa',
          area: 'Kazanchis'
        },
        type: 'villa_rent',
        bedrooms: 4,
        bathrooms: 3,
        size: 200,
        features: ['Garden', 'Parking', 'Security', 'Modern Kitchen', 'Balcony', 'Generator'],
        images: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
        status: 'approved',
        whatsappNumber: '+251991856292',
        phoneNumber: '+251991856292',
        owner: {
          name: 'Meron Tadesse',
          role: 'broker',
          phone: '+251991856292',
          whatsapp: '+251991856292'
        },
        created_at: new Date().toISOString(),
        isPremium: true,
        isFeatured: false
      }
    }
    
    const property = mockProperties[id as keyof typeof mockProperties]
    
    if (!property) {
      console.log('❌ Property not found:', id)
      return NextResponse.json({ 
        error: 'Property not found' 
      }, { status: 404 })
    }

    console.log('✅ Found property:', property.title)

    return NextResponse.json({
      success: true,
      property: property
    })

  } catch (error) {
    console.error('❌ Individual property error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}