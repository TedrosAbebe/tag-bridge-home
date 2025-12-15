import { NextResponse } from 'next/server'

// GET - Fetch active banners for public display (using mock data temporarily)
export async function GET() {
  try {
    // Mock banners data until Supabase is properly configured
    const mockBanners = [
      {
        id: "1",
        title: {
          en: "🏠 Welcome to Tag Bridge Home",
          am: "🏠 ወደ ታግ ብሪጅ ሆም እንኳን በደህና መጡ"
        },
        description: {
          en: "Find your dream home in Ethiopia with our trusted brokers",
          am: "በኢትዮጵያ ውስጥ በታማኝ ደላሎቻችን ህልምዎን ቤት ያግኙ"
        },
        buttonText: {
          en: "Get Started",
          am: "ጀምር"
        },
        buttonLink: "/submit-property",
        backgroundColor: "from-green-600 to-blue-600",
        textColor: "text-white",
        icon: "🏠",
        type: "promotion"
      },
      {
        id: "2",
        title: {
          en: "💰 Special Offer",
          am: "💰 ልዩ ቅናش"
        },
        description: {
          en: "Premium listings starting from 50 ETB - Boost your property visibility!",
          am: "ከ50 ብር ጀምሮ የፕሪሚየም ዝርዝሮች - የንብረትዎን ታይነት ያሳድጉ!"
        },
        buttonText: {
          en: "Learn More",
          am: "ተጨማሪ ይወቁ"
        },
        buttonLink: "/register-advertiser",
        backgroundColor: "from-purple-600 to-pink-600",
        textColor: "text-white",
        icon: "💰",
        type: "feature"
      }
    ]

    return NextResponse.json({
      success: true,
      banners: mockBanners
    })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}