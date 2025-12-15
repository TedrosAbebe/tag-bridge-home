import { NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import path from 'path'

// Initialize database
const dbPath = path.join(process.cwd(), 'broker.db')
const db = new Database(dbPath)

// GET - Fetch active banners for public display
export async function GET() {
  try {
    const banners = db.prepare(`
      SELECT 
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
        type
      FROM banners 
      WHERE is_active = 1
      ORDER BY created_at DESC
    `).all() as any[]

    // Transform to match the frontend format
    const formattedBanners = banners.map(banner => ({
      id: banner.id,
      title: {
        en: banner.title_en,
        am: banner.title_am
      },
      description: {
        en: banner.description_en,
        am: banner.description_am
      },
      buttonText: {
        en: banner.button_text_en,
        am: banner.button_text_am
      },
      buttonLink: banner.button_link,
      backgroundColor: banner.background_color,
      textColor: banner.text_color,
      icon: banner.icon,
      type: banner.type
    }))

    return NextResponse.json({
      success: true,
      banners: formattedBanners
    })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}