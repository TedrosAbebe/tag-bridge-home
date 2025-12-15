import { NextRequest, NextResponse } from 'next/server'
import { favoriteOperations } from '../../../lib/database'
import { getUserFromToken } from '../../../lib/auth'

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

    const favorites = favoriteOperations.getByUser.all(user.id)

    const favoritesWithImages = favorites.map((favorite: any) => ({
      ...favorite,
      features: favorite.features ? JSON.parse(favorite.features) : []
    }))

    return NextResponse.json({ favorites: favoritesWithImages })

  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const { propertyId, action } = await request.json()

    if (!propertyId || !action) {
      return NextResponse.json(
        { error: 'Property ID and action are required' },
        { status: 400 }
      )
    }

    if (action === 'add') {
      const favoriteId = 'fav-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
      favoriteOperations.add.run(favoriteId, user.id, propertyId)
      
      return NextResponse.json({
        success: true,
        message: 'Property added to favorites'
      })
    } else if (action === 'remove') {
      favoriteOperations.remove.run(user.id, propertyId)
      
      return NextResponse.json({
        success: true,
        message: 'Property removed from favorites'
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "add" or "remove"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error managing favorite:', error)
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

    const user = getUserFromToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const propertyId = searchParams.get('propertyId')

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      )
    }

    favoriteOperations.remove.run(user.id, propertyId)

    return NextResponse.json({
      success: true,
      message: 'Property removed from favorites'
    })

  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}