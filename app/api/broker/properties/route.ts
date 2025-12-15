import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '../../../../lib/auth'

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
        { status: 403 }
      )
    }

    // Only allow admin and broker roles
    if (user.role !== 'admin' && user.role !== 'broker') {
      return NextResponse.json(
        { error: 'Broker or admin access required' },
        { status: 403 }
      )
    }

    // For now, return mock properties since we're focusing on auth
    // In a real app, you would query the properties database
    const mockProperties = [
      {
        id: 'prop-1',
        title: 'Beautiful 2BR Apartment in Bole',
        status: 'approved',
        price: 150000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'Bole',
        type: 'rent',
        created_at: new Date().toISOString()
      },
      {
        id: 'prop-2', 
        title: 'Modern Villa in CMC',
        status: 'pending',
        price: 2500000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'CMC',
        type: 'sale',
        created_at: new Date().toISOString()
      }
    ]

    return NextResponse.json({ 
      properties: mockProperties
    })

  } catch (error) {
    console.error('Error fetching broker properties:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}