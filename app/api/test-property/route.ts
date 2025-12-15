import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 TEST PROPERTY API CALLED')
    
    const body = await request.json()
    console.log('📝 Received data:', body)
    
    // Just return success without doing anything
    return NextResponse.json({
      success: true,
      message: 'Test API working!',
      receivedData: body
    })
    
  } catch (error) {
    console.error('❌ Test API error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}