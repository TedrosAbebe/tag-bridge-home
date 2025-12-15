import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase-database'

export async function GET(request: NextRequest) {
  try {
    // Get all advertiser applications
    const { data: applications, error } = await supabase
      .from('advertiser_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      applications: applications || []
    })

  } catch (error) {
    console.error('Error fetching advertiser applications:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { applicationId, status, reviewedBy } = await request.json()
    
    if (!applicationId || !status || !reviewedBy) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update application status
    const { error } = await supabase
      .from('advertiser_applications')
      .update({ 
        status, 
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`
    })

  } catch (error) {
    console.error('Error updating advertiser application:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  console.log('🗑️ DELETE advertiser application API called')
  
  try {
    const body = await request.json()
    const { applicationId } = body
    
    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      )
    }

    // Delete the application
    const { error } = await supabase
      .from('advertiser_applications')
      .delete()
      .eq('id', applicationId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Advertiser application deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting advertiser application:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}