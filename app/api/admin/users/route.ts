import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import { userOperations } from '../../../../lib/supabase-database'

export async function GET(request: NextRequest) {
  console.log('👑 ADMIN USERS API CALLED')
  
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('✅ Admin authenticated:', decoded.username)

    // Get all users from database
    const users = await userOperations.getAll()

    console.log('✅ Found', users.length, 'users')

    // Calculate user statistics
    const stats = users.reduce((acc: any, u: any) => {
      acc[u.role] = (acc[u.role] || 0) + 1
      return acc
    }, {})

    return NextResponse.json({ 
      success: true,
      users,
      stats
    })

  } catch (error) {
    console.error('❌ Admin users error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Note: User management operations are now handled by /api/admin/manage-users