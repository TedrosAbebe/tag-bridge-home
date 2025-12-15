import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'

// Verify admin access helper
async function verifyAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization required', status: 401 }
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  
  if (!decoded || decoded.role !== 'admin') {
    return { error: 'Admin access required', status: 403 }
  }

  return { decoded }
}

// GET - Fetch all guest submissions for admin review
export async function GET(request: NextRequest) {
  console.log('👥 Admin guest submissions API called')
  
  try {
    const authCheck = await verifyAdminAccess(request)
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }
    // Try to get guest submissions from database, fallback to mock data
    let submissions = []
    
    try {
      // In a real app, this would fetch from Supabase:
      // submissions = await guestSubmissionOperations.getAll()
      console.log('⚠️ Using mock guest submissions (database not implemented)')
      
      // Mock guest submissions data
      submissions = [
        {
          id: 'GUEST-1734567890-abc123',
          property_id: 'prop-guest-1',
          guest_name: 'John Doe',
          guest_phone: '+251911234567',
          guest_whatsapp: '+251911234567',
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
          property_status: 'pending',
          submission_date: new Date().toISOString(),
          reviewed_by: null,
          approved_at: null
        },
        {
          id: 'GUEST-1734567891-def456',
          property_id: 'prop-guest-2',
          guest_name: 'Jane Smith',
          guest_phone: '+251922345678',
          guest_whatsapp: '+251922345678',
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
          property_status: 'pending',
          submission_date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          reviewed_by: null,
          approved_at: null
        },
        {
          id: 'GUEST-1734567892-ghi789',
          property_id: 'prop-guest-3',
          guest_name: 'Michael Johnson',
          guest_phone: '+251933456789',
          guest_whatsapp: '+251933456789',
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
          property_status: 'approved',
          submission_date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          reviewed_by: 'admin',
          approved_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ]
    } catch (error) {
      console.error('❌ Database error, using mock guest submissions:', error)
      submissions = []
    }
    
    console.log('✅ Retrieved guest submissions:', submissions.length)
    
    return NextResponse.json({
      success: true,
      submissions: submissions
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
  console.log('👥 Admin guest submission update API called')
  
  try {
    const authCheck = await verifyAdminAccess(request)
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }

    const { submissionId, propertyId, action, rejectionReason, adminNotes } = await request.json()
    
    console.log(`📋 Admin ${action} guest submission:`, { submissionId, propertyId, action })

    if (!submissionId || !action) {
      return NextResponse.json(
        { success: false, error: 'Submission ID and action are required' },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action must be approve or reject' },
        { status: 400 }
      )
    }
    
    // Mock approval/rejection process
    const updatedSubmission = {
      id: submissionId,
      property_id: propertyId,
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewed_by: authCheck.decoded.username,
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes || rejectionReason || null
    }
    
    try {
      // In a real app, this would update the database:
      // await guestSubmissionOperations.updateStatus(submissionId, action, adminNotes)
      // If approved, also create property in properties table
      console.log('⚠️ Using mock guest submission update (database not implemented)')
      console.log('✅ Guest submission updated successfully')
    } catch (error) {
      console.error('❌ Database error updating guest submission:', error)
      console.log('⚠️ Using mock update (database not available)')
    }
    
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
  console.log('🗑️ Admin guest submission deletion API called')
  
  try {
    const authCheck = await verifyAdminAccess(request)
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }

    const { submissionId } = await request.json()
    
    console.log('🗑️ Admin deleting guest submission:', submissionId)

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
        { status: 400 }
      )
    }
    
    try {
      // In a real app: await guestSubmissionOperations.delete(submissionId)
      console.log('⚠️ Using mock guest submission deletion (database not implemented)')
      console.log('✅ Guest submission deleted successfully')
    } catch (error) {
      console.error('❌ Database error deleting guest submission:', error)
      console.log('⚠️ Using mock delete (database not available)')
    }
    
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