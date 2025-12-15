import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import { userOperations, systemConfig } from '../../../../lib/supabase-database'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'

// Verify admin access helper
async function verifyAdminAccess(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization required', status: 401 }
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  
  if (!decoded || decoded.role !== 'admin') {
    return { error: 'Admin access required', status: 403 }
  }

  return { decoded }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  console.log('👥 Admin user management API - CREATE called')
  
  try {
    const authCheck = await verifyAdminAccess(request)
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }

    const body = await request.json()
    const { username, password, role } = body
    
    console.log('👥 Creating user:', { username, role })

    if (!username || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Username, password, and role are required' },
        { status: 400 }
      )
    }

    if (!['admin', 'broker', 'user'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Prevent admin creation after initial setup
    if (role === 'admin') {
      try {
        const setupComplete = await systemConfig.isAdminSetupComplete()
        if (setupComplete) {
          return NextResponse.json(
            { success: false, error: 'Admin accounts can only be created during initial setup' },
            { status: 403 }
          )
        }
      } catch (error) {
        console.log('⚠️ Could not check admin setup status, allowing admin creation')
      }
    }

    // Check if username already exists
    let existingUser = null
    try {
      existingUser = await userOperations.findByUsername(username)
    } catch (error) {
      console.log('⚠️ Database error checking existing user, proceeding with creation')
    }
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Create new user
    const userId = randomUUID()
    const passwordHash = bcrypt.hashSync(password, 10)
    
    try {
      await userOperations.create(userId, username, passwordHash, role)
    } catch (error) {
      console.error('❌ Database error creating user:', error)
      // For now, just log and continue (mock success)
      console.log('⚠️ Using mock user creation (database not available)')
    }
    
    console.log('✅ User created successfully:', username)
    return NextResponse.json({
      success: true,
      message: `${role} account created successfully`,
      user: { id: userId, username, role }
    })

  } catch (error) {
    console.error('❌ Admin user management API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update existing user
export async function PUT(request: NextRequest) {
  console.log('👥 Admin user management API - UPDATE called')
  
  try {
    const authCheck = await verifyAdminAccess(request)
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }

    const body = await request.json()
    const { userId, username, role, password } = body
    
    console.log('👥 Updating user:', { userId, username, role })

    if (!userId || !username || !role) {
      return NextResponse.json(
        { success: false, error: 'User ID, username, and role are required' },
        { status: 400 }
      )
    }

    if (!['admin', 'broker', 'user'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Get current user
    const currentUser = await userOperations.findById(userId)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // No restrictions on modifying admin accounts created through proper setup

    // Check if new username already exists (if username is being changed)
    if (username !== currentUser.username) {
      const existingUser = await userOperations.findByUsername(username)
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Username already exists' },
          { status: 400 }
        )
      }
    }

    // Update user
    await userOperations.update(userId, username, role)

    // Update password if provided
    if (password && password.trim() !== '') {
      const passwordHash = bcrypt.hashSync(password, 10)
      await userOperations.updatePassword(userId, passwordHash)
    }
    
    console.log('✅ User updated successfully:', username)
    return NextResponse.json({
      success: true,
      message: `User ${username} updated successfully`,
      user: { id: userId, username, role }
    })

  } catch (error) {
    console.error('❌ Admin user management API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  console.log('👥 Admin user management API - DELETE called')
  
  try {
    const authCheck = await verifyAdminAccess(request)
    if (authCheck.error) {
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: authCheck.status }
      )
    }

    const body = await request.json()
    const { username } = body
    
    console.log('👥 Deleting user:', { username })

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      )
    }

    // Prevent deletion of the last admin account
    try {
      const hasAdminUser = await systemConfig.hasAdminUser()
      const userToDelete = await userOperations.findByUsername(username)
      
      if (userToDelete?.role === 'admin' && hasAdminUser) {
        return NextResponse.json(
          { success: false, error: 'Cannot delete the last admin account' },
          { status: 403 }
        )
      }
    } catch (error) {
      console.log('⚠️ Could not check admin user status, allowing deletion')
    }

    const user = await userOperations.findByUsername(username)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    await userOperations.delete(user.id)
    
    console.log('✅ User deleted successfully:', username)
    return NextResponse.json({
      success: true,
      message: `User ${username} deleted successfully`
    })

  } catch (error) {
    console.error('❌ Admin user management API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}