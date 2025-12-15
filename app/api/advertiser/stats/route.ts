import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd calculate these from the database
    // For now, we'll return sample stats
    
    const sampleStats = {
      totalProperties: 15,
      activeProperties: 12,
      totalViews: 1247,
      totalInquiries: 89,
      pendingProperties: 3
    }

    return NextResponse.json({
      success: true,
      stats: sampleStats
    })

  } catch (error) {
    console.error('Error fetching advertiser stats:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}