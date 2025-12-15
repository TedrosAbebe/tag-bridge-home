import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userOperations, brokerOperations } from '../../../../lib/supabase-database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  console.log('🔐 Login API called (using Supabase database)')
  
  try {
    const body = await request.json()
    const { username, password } = body
    
    console.log('🔐 Login request:', { username, hasPassword: !!password })

    if (!username || !password) {
      console.log('❌ Missing username or password')
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Try to find user in Supabase database
    let user
    try {
      user = await userOperations.findByUsername(username)
    } catch (error) {
      console.error('❌ Database error finding user:', error)
      
      // Fallback to mock users if database is not available
      console.log('🔄 Falling back to mock users')
      const mockUsers = [
        {
          id: '1',
          username: 'admin',
          password_hash: bcrypt.hashSync('admin123', 10),
          role: 'admin',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          username: 'broker1',
          password_hash: bcrypt.hashSync('broker123', 10),
          role: 'broker',
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          username: 'user1',
          password_hash: bcrypt.hashSync('user123', 10),
          role: 'user',
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          username: 'tedros',
          password_hash: bcrypt.hashSync('494841', 10),
          role: 'admin',
          created_at: new Date().toISOString()
        }
      ]
      
      user = mockUsers.find(u => u.username === username)
    }
    
    if (!user) {
      console.log('❌ User not found:', username)
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    console.log('✅ User found:', user.username, '(' + user.role + ')')

    // Verify password
    if (!bcrypt.compareSync(password, user.password_hash)) {
      console.log('❌ Invalid password for user:', user.username)
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      )
    }

    console.log('✅ Password verified for user:', user.username)

    // Get broker status if user is a broker
    let brokerStatus = null
    if (user.role === 'broker') {
      try {
        const brokerInfo = await brokerOperations.findByUserId(user.id)
        brokerStatus = brokerInfo?.status || 'approved' // Default to approved if no broker info
        console.log('📋 Broker status:', brokerStatus)
      } catch (error) {
        console.error('❌ Error getting broker status:', error)
        brokerStatus = 'approved' // Fallback to approved
      }
    }

    // Update last login time (only if using real database)
    try {
      await userOperations.updateLastLogin(user.id)
      console.log('✅ Updated last login time for:', user.username)
    } catch (error) {
      console.log('⚠️ Could not update last login time (using mock data):', error)
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    console.log('✅ Login successful for:', user.username)

    // Prepare response message
    let message = 'Login successful'
    if (user.role === 'broker' && brokerStatus === 'pending') {
      message = 'Login successful! Your broker account is pending admin approval.'
    } else if (user.role === 'broker' && brokerStatus === 'rejected') {
      message = 'Login successful. Your broker application was rejected. Please contact support.'
    }

    return NextResponse.json({
      success: true,
      message,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        brokerStatus: brokerStatus
      }
    })

  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}