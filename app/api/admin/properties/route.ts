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

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Return mock properties for testing
    const mockProperties = [
      {
        id: 'admin-prop-1',
        title: 'Luxury Villa in Kazanchis',
        status: 'approved',
        price: 5000000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'Kazanchis',
        type: 'sale',
        broker_id: 'broker-1',
        created_at: new Date().toISOString()
      },
      {
        id: 'admin-prop-2',
        title: 'Modern Apartment in Megenagna',
        status: 'pending',
        price: 180000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'Megenagna',
        type: 'rent',
        broker_id: 'broker-2',
        created_at: new Date().toISOString()
      },
      {
        id: 'admin-prop-3',
        title: 'Commercial Space in Piassa',
        status: 'rejected',
        price: 3500000,
        currency: 'ETB',
        city: 'Addis Ababa',
        area: 'Piassa',
        type: 'sale',
        broker_id: 'broker-1',
        created_at: new Date().toISOString()
      }
    ]

    return NextResponse.json({ 
      properties: mockProperties
    })

  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Mock property update for now
    return NextResponse.json({
      success: true,
      message: 'Property updated successfully'
    })

  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Mock property deletion for now
    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}