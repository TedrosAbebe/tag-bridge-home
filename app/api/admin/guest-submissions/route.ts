import { NextRequest, NextResponse } from 'next/server'

// GET - Fetch all guest submissions for admin review
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
        description: 'Modern house with garden and parking space. Located in a quiet neighborhood with easy access to main roads.',
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
        description: 'Spacious 2-bedroom apartment with city view and modern amenities.',
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
      },
      {
        id: 'GUEST-1734567892-ghi789',
        guestName: 'Michael Johnson',
        guestPhone: '+251933456789',
        guestWhatsapp: '+251933456789',
        title: 'Commercial Space in Merkato',
        description: 'Prime commercial location perfect for retail business.',
        price: 50000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'Merkato',
        type: 'commercial_rent',
        bedrooms: 0,
        bathrooms: 1,
        size: 120,
        features: ['High Traffic Area', 'Security', 'Parking'],
        images: ['/api/placeholder/400/300'],
        status: 'approved',
        submitted_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        reviewed_by: 'admin',
        approved_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
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

// PUT - Approve or reject guest submission
export async function PUT(request: NextRequest) {
  try {
    const { submissionId, action, adminNotes } = await request.json()
    
    console.log(`📋 Admin ${action} submission:`, submissionId)
    
    // Mock approval/rejection process
    const updatedSubmission = {
      id: submissionId,
      status: action, // 'approved' or 'rejected'
      reviewed_by: 'admin',
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes || null
    }
    
    // In a real app, update the database:
    // await guestSubmissionOperations.updateStatus(submissionId, action, adminNotes)
    
    return NextResponse.json({
      success: true,
      message: `Submission ${action} successfully`,
      submission: updatedSubmission
    })
    
  } catch (error) {
    console.error('❌ Error updating submission:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update submission'
    }, { status: 500 })
  }
}

// DELETE - Delete guest submission
export async function DELETE(request: NextRequest) {
  try {
    const { submissionId } = await request.json()
    
    console.log('🗑️ Admin deleting submission:', submissionId)
    
    // Mock deletion process
    // In a real app: await guestSubmissionOperations.delete(submissionId)
    
    return NextResponse.json({
      success: true,
      message: 'Submission deleted successfully'
    })
    
  } catch (error) {
    console.error('❌ Error deleting submission:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete submission'
    }, { status: 500 })
  }
}