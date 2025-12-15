import { NextRequest, NextResponse } from 'next/server'
import { propertyOperations, imageOperations } from '../../../../lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = propertyOperations.findById.get(params.id) as any

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Get property images
    const images = imageOperations.getByProperty.all(property.id)

    const propertyWithImages = {
      ...property,
      images: images.map((img: any) => img.image_url),
      features: property.features ? JSON.parse(property.features) : []
    }

    return NextResponse.json({ property: propertyWithImages })

  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}