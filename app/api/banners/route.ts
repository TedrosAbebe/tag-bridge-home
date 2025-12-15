import { NextResponse } from 'next/server'
import { bannerOperations } from '../../../lib/supabase-database'

// GET - Fetch active banners for public display
export async function GET() {
  try {
    const banners = await bannerOperations.getActive()

    // Transform to match the frontend format
    const formattedBanners = banners.map(banner => ({
      id: banner.id,
      title: {
        en: banner.title_en,
        am: banner.title_am
      },
      message: {
        en: banner.message_en,
        am: banner.message_am
      },
      backgroundColor: banner.background_color,
      textColor: banner.text_color,
      icon: banner.icon,
      type: banner.banner_type
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