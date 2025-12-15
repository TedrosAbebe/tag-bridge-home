import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  console.log('🔐 Login API called (using main database)')
  
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

    // Use main database (same as registration)
    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      // Find user in clean database
      const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any
      
      if (!user) {
        console.log('❌ User not found in database:', username)
        return NextResponse.json(
          { success: false, message: 'Invalid username or password' },
          { status: 401 }
        )
      }

      console.log('✅ User found in database:', user.username, '(' + user.role + ')')

      // Verify password
      if (!bcrypt.compareSync(password, user.password_hash)) {
        console.log('❌ Invalid password for user:', user.username)
        return NextResponse.json(
          { success: false, message: 'Invalid username or password' },
          { status: 401 }
        )
      }

      console.log('✅ Password verified for user:', user.username)

      // Check broker approval status if user is a broker
      let brokerStatus = null
      if (user.role === 'broker') {
        try {
          const brokerInfo = db.prepare('SELECT status FROM broker_info WHERE user_id = ?').get(user.id) as any
          brokerStatus = brokerInfo?.status || 'pending'
          console.log('📋 Broker status:', brokerStatus)
        } catch (error) {
          console.log('⚠️ Could not check broker status:', error)
        }
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

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}