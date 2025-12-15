import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'

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

export async function GET(request: NextRequest) {
  console.log('💳 Admin payments API called')
  
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Simple mock payments data
    const payments = [
      {
        id: '1',
        property_title: 'Modern Apartment in Bole',
        amount: 25,
        status: 'awaiting_payment',
        submitted_by: 'broker1'
      },
      {
        id: '2',
        property_title: 'Villa in Kazanchis',
        amount: 50,
        status: 'awaiting_payment',
        submitted_by: 'broker2'
      }
    ]

    return NextResponse.json({
      success: true,
      payments
    })

  } catch (error) {
    console.error('❌ Admin payments API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  console.log('💳 Admin payments update API called')
  
  try {
    const authCheck = await verifyAdminAccess(request)
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }

    const body = await request.json()
    const { paymentId, action } = body
    
    if (!paymentId || !action) {
      return NextResponse.json(
        { success: false, error: 'Payment ID and action are required' },
        { status: 400 }
      )
    }

    const message = action === 'approve' 
      ? 'Payment approved successfully!'
      : 'Payment rejected successfully.'
    
    return NextResponse.json({
      success: true,
      message
    })

  } catch (error) {
    console.error('❌ Admin payments API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}