import { NextRequest, NextResponse } from 'next/server'

// POST - Submit property as guest (no registration required)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Generate a unique submission ID
    const submissionId = `GUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // For now, we'll use mock storage until Supabase is properly configured
    // In a real implementation, this would save to the database
    
    console.log('📝 Guest Property Submission:', {
      submissionId,
      title: data.title,
      guestName: data.guestName,
      city: data.city,
      type: data.type,
      price: data.price
    })
    
    // Mock successful submission
    const mockSubmission = {
      id: submissionId,
      ...data,
      status: 'pending',
      submitted_at: new Date().toISOString(),
      reviewed_by: null,
      approved_at: null
    }
    
    // In a real app, save to database:
    // await guestSubmissionOperations.create(mockSubmission)
    
    return NextResponse.json({
      success: true,
      message: 'Property submitted successfully for review',
      submissionId: submissionId,
      submission: mockSubmission
    })
    
  } catch (error) {
    console.error('❌ Guest submission error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to submit property'
    }, { status: 500 })
  }
}

// GET - Fetch all guest submissions (for admin)
export async function GET() {
  try {
    // Mock guest submissions data
    const mockSubmissions = [
      {
        id: 'GUEST-1734567890-abc123',
        guestName: 'John Doe',
        guestPhone: '+251911234567',
        guestWhatsapp: '+251911234567',
        title: 'Beautiful 3 Bedroom House in Bole',
        description: 'Modern house with garden and parking',
        price: 25000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'Bole',
        type: 'house_rent',
        bedrooms: 3,
        bathrooms: 2,
        size: 150,
        features: ['Parking', 'Garden', 'Modern Kitchen'],
        images: ['/api/placeholder/400/300'],
        status: 'pending',
        submitted_at: new Date().toISOString(),
        reviewed_by: null,
        approved_at: null
      },
      {
        id: 'GUEST-1734567891-def456',
        guestName: 'Jane Smith',
        guestPhone: '+251922345678',
        guestWhatsapp: '+251922345678',
        title: 'Apartment for Sale in Kazanchis',
        description: 'Spacious apartment with city view',
        price: 3500000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'Kazanchis',
        type: 'apartment_sale',
        bedrooms: 2,
        bathrooms: 1,
        size: 80,
        features: ['Elevator', 'Security', 'Balcony'],
        images: ['/api/placeholder/400/300'],
        status: 'pending',
        submitted_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        reviewed_by: null,
        approved_at: null
      }
    ]
    
    return NextResponse.json({
      success: true,
      submissions: mockSubmissions
    })
    
  } catch (error) {
    console.error('❌ Error fetching guest submissions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch submissions'
    }, { status: 500 })
  }
}