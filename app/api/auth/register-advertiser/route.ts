import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phoneNumber', 'businessName', 'businessType', 'city', 'area']
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)
    
    // Create advertiser_applications table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS advertiser_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT NOT NULL,
        whatsapp_number TEXT,
        business_name TEXT NOT NULL,
        business_type TEXT NOT NULL,
        business_license TEXT,
        years_in_business INTEGER,
        city TEXT NOT NULL,
        area TEXT NOT NULL,
        address TEXT,
        services TEXT,
        specialization TEXT,
        website TEXT,
        social_media TEXT,
        description TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        reviewed_at DATETIME,
        reviewed_by TEXT
      )
    `)
    
    // Check if email already exists
    const existingUser = db.prepare('SELECT email FROM advertiser_applications WHERE email = ?').get(formData.email)

    if (existingUser) {
      db.close()
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      )
    }

    // Insert advertiser application
    const insertStmt = db.prepare(`
      INSERT INTO advertiser_applications (
        full_name, email, phone_number, whatsapp_number,
        business_name, business_type, business_license, years_in_business,
        city, area, address, services, specialization,
        website, social_media, description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = insertStmt.run(
      formData.fullName,
      formData.email,
      formData.phoneNumber,
      formData.whatsappNumber || null,
      formData.businessName,
      formData.businessType,
      formData.businessLicense || null,
      formData.yearsInBusiness ? parseInt(formData.yearsInBusiness) : null,
      formData.city,
      formData.area,
      formData.address || null,
      JSON.stringify(formData.services || []),
      formData.specialization || null,
      formData.website || null,
      formData.socialMedia || null,
      formData.description || null
    )

    db.close()

    return NextResponse.json({
      success: true,
      message: 'Advertiser application submitted successfully',
      applicationId: result.lastInsertRowid
    })

  } catch (error) {
    console.error('Advertiser registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}