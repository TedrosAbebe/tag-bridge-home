import { NextRequest, NextResponse } from 'next/server'
import { propertyOperations, imageOperations } from '../../../lib/database'
import { getUserFromToken } from '../../../lib/auth'
import { createPaymentRecord } from '../../../lib/payment'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const bathrooms = searchParams.get('bathrooms')

    let properties

    if (search) {
      const searchTerm = `%${search}%`
      properties = propertyOperations.search.all(searchTerm, searchTerm, searchTerm)
    } else if (type || city || minPrice || maxPrice || bedrooms || bathrooms) {
      properties = propertyOperations.filter.all(
        type, type,
        city, city,
        minPrice ? parseFloat(minPrice) : null, minPrice ? parseFloat(minPrice) : null,
        maxPrice ? parseFloat(maxPrice) : null, maxPrice ? parseFloat(maxPrice) : null,
        bedrooms ? parseInt(bedrooms) : null, bedrooms ? parseInt(bedrooms) : null,
        bathrooms ? parseInt(bathrooms) : null, bathrooms ? parseInt(bathrooms) : null
      )
    } else {
      properties = propertyOperations.getApproved.all()
    }

    // Add images to each property
    const propertiesWithImages = properties.map((property: any) => {
      const images = imageOperations.getByProperty.all(property.id)
      return {
        ...property,
        images: images.map((img: any) => img.image_url),
        features: property.features ? JSON.parse(property.features) : []
      }
    })

    return NextResponse.json({ properties: propertiesWithImages })

  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const {
      title,
      description,
      price,
      currency = 'ETB',
      city,
      area,
      latitude,
      longitude,
      type,
      bedrooms,
      bathrooms,
      size,
      features,
      whatsappNumber,
      phoneNumber,
      images
    } = await request.json()

    // Validation
    if (!title || !price || !city || !area || !type || !size || !whatsappNumber || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const propertyId = 'property-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)

    console.log('🏠 Creating property with ID:', propertyId)
    console.log('👤 User ID:', user.id)
    console.log('📝 Property data:', { title, price, city, area, type, size })

    // Create property with pending_payment status
    console.log('💾 Inserting property into database...')
    propertyOperations.create.run(
      propertyId,
      title,
      description || '',
      parseFloat(price),
      currency,
      city,
      area,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null,
      type,
      bedrooms ? parseInt(bedrooms) : null,
      bathrooms ? parseInt(bathrooms) : null,
      parseFloat(size),
      JSON.stringify(features || []),
      user.id,
      whatsappNumber,
      phoneNumber
    )
    console.log('✅ Property inserted successfully')

    // Add images if provided
    if (images && images.length > 0) {
      console.log('🖼️ Adding', images.length, 'images...')
      images.forEach((imageUrl: string, index: number) => {
        const imageId = 'img-' + Date.now() + '-' + index
        imageOperations.add.run(imageId, propertyId, imageUrl, index === 0)
      })
      console.log('✅ Images added successfully')
    }

    // Create payment record
    console.log('💳 Creating payment record...')
    const paymentInfo = createPaymentRecord(propertyId, user.id, type)
    console.log('✅ Payment record created:', paymentInfo.id)

    return NextResponse.json({
      success: true,
      property: {
        id: propertyId,
        status: 'pending_payment'
      },
      payment: paymentInfo
    })

  } catch (error) {
    console.error('❌ Error creating property:', error)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error code:', error.code)
    console.error('❌ Error stack:', error.stack)
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}