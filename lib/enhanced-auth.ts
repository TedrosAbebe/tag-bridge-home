import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { userOperations } from './auth-database'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface EnhancedAuthUser {
  id: string
  username: string
  email?: string
  phone?: string
  role: 'admin' | 'broker' | 'user'
  whatsappNumber?: string
}

// Enhanced login that supports both username and email
export function authenticateUserEnhanced(
  identifier: string, // Can be username or email
  password: string
): { user: EnhancedAuthUser; token: string; requiresOTP?: boolean } | null {
  console.log('🔐 Enhanced authentication for:', { identifier })
  
  try {
    // Try to find user by username first, then by email-like identifier
    let user = userOperations.findByUsername.get(identifier) as any
    
    // If not found and identifier looks like email, treat as email login
    if (!user && identifier.includes('@')) {
      // For now, map email to username (in real system, you'd have email field)
      user = userOperations.findByUsername.get(identifier) as any
    }
    
    if (!user) {
      console.log('❌ User not found for identifier:', identifier)
      return null
    }
    
    console.log('👤 Found user:', { id: user.id, username: user.username, role: user.role })
    
    if (!bcrypt.compareSync(password, user.password_hash)) {
      console.log('❌ Invalid password for user:', user.username)
      return null
    }

    // Update last login
    userOperations.updateLastLogin.run(user.id)
    console.log('✅ Login successful for:', user.username)

    const authUser: EnhancedAuthUser = {
      id: user.id,
      username: user.username,
      email: user.username.includes('@') ? user.username : undefined,
      role: user.role,
      phone: user.phone || undefined,
      whatsappNumber: user.whatsapp_number || undefined
    }

    const token = jwt.sign(
      { 
        id: authUser.id, 
        username: authUser.username,
        role: authUser.role,
        email: authUser.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // For admin users, we could require OTP (simplified for demo)
    const requiresOTP = user.role === 'admin' && process.env.REQUIRE_ADMIN_OTP === 'true'
    
    return { user: authUser, token, requiresOTP }
  } catch (error) {
    console.error('❌ Error in enhanced authentication:', error)
    return null
  }
}

// OTP Management (simplified implementation)
const otpStore = new Map<string, { otp: string; expiresAt: Date; email: string }>()

export function generateOTP(email: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  
  otpStore.set(email, { otp, expiresAt, email })
  
  console.log(`📧 OTP generated for ${email}: ${otp} (expires at ${expiresAt})`)
  return otp
}

export function verifyOTP(email: string, providedOTP: string): boolean {
  const stored = otpStore.get(email)
  
  if (!stored) {
    console.log('❌ No OTP found for email:', email)
    return false
  }
  
  if (new Date() > stored.expiresAt) {
    console.log('❌ OTP expired for email:', email)
    otpStore.delete(email)
    return false
  }
  
  if (stored.otp !== providedOTP) {
    console.log('❌ Invalid OTP for email:', email)
    return false
  }
  
  console.log('✅ OTP verified for email:', email)
  otpStore.delete(email)
  return true
}

export function sendOTPEmail(email: string, otp: string): boolean {
  // In a real system, you would send email here
  // For demo, we just log it
  console.log(`📧 Sending OTP email to ${email}:`)
  console.log(`Subject: Your Ethiopia Home Broker Login Code`)
  console.log(`Body: Your login code is: ${otp}`)
  console.log(`This code expires in 10 minutes.`)
  
  return true
}