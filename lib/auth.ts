import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { userOperations } from './auth-database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthUser {
  id: string
  username: string
  role: 'admin' | 'broker' | 'user'
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}

// User Login: Username + Password
export function authenticateUser(username: string, password: string): { user: AuthUser; token: string } | null {
  console.log('🔐 Authenticating user:', { username })
  
  try {
    const user = userOperations.findByUsername.get(username) as any
    
    if (!user) {
      console.log('❌ User not found for username:', username)
      return null
    }
    
    console.log('👤 Found user:', { id: user.id, username: user.username, role: user.role })
    
    if (!verifyPassword(password, user.password_hash)) {
      console.log('❌ Invalid password for user:', user.username)
      return null
    }

    // Update last login
    userOperations.updateLastLogin.run(user.id)
    console.log('✅ Login successful, updated last login for:', user.username)

    const authUser: AuthUser = {
      id: user.id,
      username: user.username,
      role: user.role
    }

    const token = generateToken(authUser)
    console.log('🎫 Generated JWT token for user:', user.username)
    
    return { user: authUser, token }
  } catch (error) {
    console.error('❌ Error authenticating user:', error)
    return null
  }
}

// User Registration
export async function registerUser(
  username: string, 
  password: string, 
  role: 'admin' | 'broker' | 'user' = 'user'
): Promise<{ user: AuthUser; token: string } | { error: string }> {
  
  console.log('📝 Registering user:', { username, role })
  
  try {
    // Check if user already exists
    console.log('🔍 Checking if user already exists...')
    const existingUser = userOperations.findByUsername.get(username)
    if (existingUser) {
      console.log('❌ User already exists with username:', username)
      return { error: 'User with this username already exists' }
    }
    console.log('✅ Username is available')

    const userId = 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9)
    console.log('🆔 Generated user ID:', userId)
    
    const passwordHash = hashPassword(password)
    console.log('🔐 Password hashed successfully')

    console.log('💾 Attempting to create user in database...')

    // Create user account
    try {
      userOperations.create.run(
        userId,
        username,
        passwordHash,
        role
      )
      console.log('✅ User created successfully in database')
    } catch (dbError: any) {
      console.error('❌ Database creation error:', dbError)
      return { error: `Database error: ${dbError.message}` }
    }

    // Verify the user was actually created
    console.log('🔍 Verifying user was created...')
    const createdUser = userOperations.findByUsername.get(username) as any
    if (!createdUser) {
      console.error('❌ User was not found after creation!')
      return { error: 'User creation verification failed' }
    }
    console.log('✅ User creation verified:', { id: createdUser.id, username: createdUser.username })

    const authUser: AuthUser = {
      id: userId,
      username,
      role
    }

    console.log('🎫 Generating JWT token...')
    const token = generateToken(authUser)
    console.log('✅ JWT token generated successfully for user:', username)
    
    return { user: authUser, token }
  } catch (error: any) {
    console.error('❌ Error creating user account:', error)
    return { error: `Registration failed: ${error.message}` }
  }
}

export function getUserFromToken(token: string): AuthUser | null {
  const decoded = verifyToken(token)
  if (!decoded) return null

  // Verify user still exists in database
  const user = userOperations.findById.get(decoded.id) as any
  if (user) {
    return {
      id: user.id,
      username: user.username,
      role: user.role
    }
  }

  return null
}