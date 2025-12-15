import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { bannerOperations } from '../../../../lib/supabase-database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Verify admin token
function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.role !== 'admin') {
      return null
    }
    return decoded
  } catch (error) {
    return null
  }
}

// GET - Fetch all banners
export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const banners = await bannerOperations.getAll()

    return NextResponse.json({
      success: true,
      banners
    })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new banner
export async function POST(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title_en,
      title_am,
      message_en,
      message_am,
      banner_type,
      background_color,
      text_color,
      icon,
      is_active
    } = body

    if (!title_en || !title_am || !message_en || !message_am) {
      return NextResponse.json(
        { error: 'Title and message in both languages are required' },
        { status: 400 }
      )
    }

    const bannerData = {
      title_en,
      title_am,
      message_en,
      message_am,
      banner_type: banner_type || 'promotion',
      background_color: background_color || '#3B82F6',
      text_color: text_color || '#FFFFFF',
      icon: icon || '🏠',
      is_active: is_active !== false
    }

    const banner = await bannerOperations.create(bannerData)

    return NextResponse.json({
      success: true,
      banner
    })
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update banner
export async function PUT(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      )
    }

    const banner = await bannerOperations.update(id, updateData)

    return NextResponse.json({
      success: true,
      banner
    })
  } catch (error) {
    console.error('Error updating banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete banner
export async function DELETE(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Banner ID is required' },
        { status: 400 }
      )
    }

    await bannerOperations.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}