import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import jwt from 'jsonwebtoken'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Initialize database
const dbPath = path.join(process.cwd(), 'broker.db')
const db = new Database(dbPath)

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

    const banners = db.prepare(`
      SELECT * FROM banners 
      ORDER BY created_at DESC
    `).all()

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
      id,
      title_en,
      title_am,
      description_en,
      description_am,
      button_text_en,
      button_text_am,
      button_link,
      background_color,
      text_color,
      icon,
      type,
      is_active
    } = body

    // Validate required fields
    if (!id || !title_en || !title_am || !description_en || !description_am || 
        !button_text_en || !button_text_am || !button_link) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if banner ID already exists
    const existingBanner = db.prepare('SELECT id FROM banners WHERE id = ?').get(id)
    if (existingBanner) {
      return NextResponse.json({ error: 'Banner ID already exists' }, { status: 400 })
    }

    // Insert new banner
    const insertBanner = db.prepare(`
      INSERT INTO banners (
        id, title_en, title_am, description_en, description_am,
        button_text_en, button_text_am, button_link, background_color,
        text_color, icon, type, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)

    insertBanner.run(
      id,
      title_en,
      title_am,
      description_en,
      description_am,
      button_text_en,
      button_text_am,
      button_link,
      background_color || 'from-blue-500 to-purple-600',
      text_color || 'text-white',
      icon || '🎉',
      type || 'promotion',
      is_active !== undefined ? is_active : 1
    )

    return NextResponse.json({
      success: true,
      message: 'Banner created successfully'
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
    const {
      id,
      title_en,
      title_am,
      description_en,
      description_am,
      button_text_en,
      button_text_am,
      button_link,
      background_color,
      text_color,
      icon,
      type,
      is_active
    } = body

    // Validate required fields
    if (!id) {
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }

    // Check if banner exists
    const existingBanner = db.prepare('SELECT id FROM banners WHERE id = ?').get(id)
    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    // Update banner
    const updateBanner = db.prepare(`
      UPDATE banners SET
        title_en = ?, title_am = ?, description_en = ?, description_am = ?,
        button_text_en = ?, button_text_am = ?, button_link = ?,
        background_color = ?, text_color = ?, icon = ?, type = ?,
        is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)

    updateBanner.run(
      title_en,
      title_am,
      description_en,
      description_am,
      button_text_en,
      button_text_am,
      button_link,
      background_color,
      text_color,
      icon,
      type,
      is_active,
      id
    )

    return NextResponse.json({
      success: true,
      message: 'Banner updated successfully'
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
      return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 })
    }

    // Check if banner exists
    const existingBanner = db.prepare('SELECT id FROM banners WHERE id = ?').get(id)
    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }

    // Delete banner
    const deleteBanner = db.prepare('DELETE FROM banners WHERE id = ?')
    deleteBanner.run(id)

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting banner:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}