import { NextRequest, NextResponse } from 'next/server'
import { propertyOperations } from '../../../../lib/supabase-database'

// GET - Fetch individual property details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  console.log('🏠 INDIVIDUAL PROPERTY API CALLED for ID:', id)
  
  try {
    // Find property in Supabase
    const property = await propertyOperations.findById(id)
    
    if (!property || property.status !== 'approved') {
      console.log('❌ Property not found or not approved:', id)
      return NextResponse.json({ 
        error: 'Property not found or not approved' 
      }, { status: 404 })
    }

    console.log('✅ Found property:', property.title)

    // Format property for the frontend
    const formattedProperty = {
      id: property.id,
      title: property.title,
      description: property.description || 'No description available.',
      price: property.price,
      currency: 'ETB',
      city: property.city,
      area: property.area,
      type: property.property_type,
      bedrooms: property.bedrooms || 3,
      bathrooms: property.bathrooms || 2,
      size: property.area,
      features: ['Modern Kitchen', 'Parking Space', 'Security'],
      status: property.status,
      owner_name: property.contact_phone,
      owner_role: 'broker',
      whatsapp_number: property.contact_whatsapp || property.contact_phone,
      phone_number: property.contact_phone,
      images: property.images || ['/api/placeholder/400/300'],
      created_at: property.created_at,
      isPremium: Boolean(property.is_premium),
      isFeatured: Boolean(property.is_featured)
    }

    return NextResponse.json({
      success: true,
      property: formattedProperty
    })

  } catch (error) {
    console.error('❌ Individual property error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}