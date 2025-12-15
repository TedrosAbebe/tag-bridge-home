import { NextRequest, NextResponse } from 'next/server'
import { paymentOperations } from '../../../lib/database'
import { getUserFromToken } from '../../../lib/auth'
import { getPaymentInstructions } from '../../../lib/payment'

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (propertyId) {
      // Get payment for specific property
      const payment = paymentOperations.findByProperty.get(propertyId) as any
      
      if (!payment) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        )
      }

      const instructions = getPaymentInstructions(payment)
      
      return NextResponse.json({
        payment,
        instructions
      })
    } else {
      // Get all payments for user
      const payments = paymentOperations.getByUser.all(user.id)
      return NextResponse.json({ payments })
    }

  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}