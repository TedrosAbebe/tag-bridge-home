import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import { userOperations, systemConfig } from '../../../../lib/auth-database'

export async function POST(request: NextRequest) {
  console.log('🔐 Admin setup API called')
  
  try {
    // Check if admin setup is already complete
    if (systemConfig.isAdminSetupComplete()) {
      return NextResponse.json(
        { success: false, error: 'Admin setup has already been completed' },
        { status: 403 }
      )
    }

    // Check if any admin user already exists
    if (systemConfig.hasAdminUser()) {
      return NextResponse.json(
        { success: false, error: 'Admin user already exists' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { username, password, setupSecret } = body
    
    console.log('🔐 Admin setup request:', { username, hasSetupSecret: !!setupSecret })

    // Validate required fields
    if (!username || !password || !setupSecret) {
      return NextResponse.json(
        { success: false, error: 'Username, password, and setup secret are required' },
        { status: 400 }
      )
    }

    // Validate setup secret
    const expectedSecret = process.env.ADMIN_SETUP_SECRET
    if (!expectedSecret || setupSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, error: 'Invalid setup secret' },
        { status: 401 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUser = userOperations.findByUsername.get(username)
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Create admin user
    const userId = randomUUID()
    const passwordHash = bcrypt.hashSync(password, 12) // Higher salt rounds for admin
    
    userOperations.create.run(userId, username, passwordHash, 'admin')
    
    // Mark admin setup as complete
    systemConfig.markAdminSetupComplete()
    
    console.log('✅ Admin user created successfully:', username)
    console.log('🔒 Admin setup marked as complete')
    
    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully. Admin setup is now complete.',
      user: { id: userId, username, role: 'admin' }
    })

  } catch (error) {
    console.error('❌ Admin setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Check admin setup status
export async function GET() {
  try {
    const setupComplete = systemConfig.isAdminSetupComplete()
    const hasAdmin = systemConfig.hasAdminUser()
    const setupEnabled = process.env.ADMIN_SETUP_ENABLED === 'true'
    
    return NextResponse.json({
      setupComplete,
      hasAdmin,
      setupEnabled,
      canSetup: !setupComplete && !hasAdmin && setupEnabled
    })
  } catch (error) {
    console.error('❌ Admin setup status check error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}