import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  console.log('🔐 WORKING LOGIN API CALLED')
  
  try {
    const { username, password } = await request.json()
    console.log('👤 Login attempt for:', username)

    if (!username || !password) {
      console.log('❌ Missing credentials')
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      )
    }

    const dbPath = join(process.cwd(), 'data', 'broker-clean.db')
    const db = new Database(dbPath)

    try {
      // Find user
      const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any
      
      if (!user) {
        console.log('❌ User not found:', username)
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      console.log('✅ User found:', user.username, '(' + user.role + ')')

      // Verify password
      if (!bcrypt.compareSync(password, user.password_hash)) {
        console.log('❌ Invalid password')
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      console.log('✅ Password verified')

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

      console.log('✅ Token generated for:', user.username)

      return NextResponse.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}