import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '../../../../lib/auth'
import { brokerOperations } from '../../../../lib/auth-database'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  console.log('📝 Register API called')
  
  try {
    const body = await request.json()
    const { username, password, role, brokerInfo } = body
    
    console.log('📝 Register request:', { username, role, hasPassword: !!password, hasBrokerInfo: !!brokerInfo })

    if (!username || !password) {
      console.log('❌ Missing username or password')
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Validate role - SECURITY: Regular registration can only create 'user' accounts
    if (role && !['broker', 'user'].includes(role)) {
      console.log('❌ Invalid role:', role)
      return NextResponse.json(
        { success: false, error: 'Invalid role. Use dedicated registration pages for broker accounts.' },
        { status: 400 }
      )
    }

    // SECURITY: Prevent admin role creation through regular registration
    if (role === 'admin') {
      console.log('🚨 SECURITY ALERT: Attempted admin registration blocked')
      return NextResponse.json(
        { success: false, error: 'Admin accounts can only be created by existing administrators.' },
        { status: 403 }
      )
    }

    // If registering as broker, validate broker info
    if (role === 'broker' && brokerInfo) {
      const { fullName, email, phone, experience, specialization } = brokerInfo
      if (!fullName || !email || !phone || !experience || !specialization) {
        console.log('❌ Missing broker information')
        return NextResponse.json(
          { success: false, error: 'All broker information fields are required' },
          { status: 400 }
        )
      }
    }

    const result = await registerUser(username, password, role || 'user')
    
    if ('error' in result) {
      console.log('❌ Registration failed:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    // If broker registration, save broker info
    if (role === 'broker' && brokerInfo) {
      try {
        const brokerId = randomUUID()
        brokerOperations.create.run(
          brokerId,
          result.user.id,
          brokerInfo.fullName,
          brokerInfo.email,
          brokerInfo.phone,
          brokerInfo.licenseNumber || null,
          brokerInfo.experience,
          brokerInfo.specialization
        )
        console.log('✅ Broker info saved for:', result.user.username)
      } catch (brokerError) {
        console.error('❌ Failed to save broker info:', brokerError)
        // Note: User is already created, but broker info failed
        return NextResponse.json(
          { success: false, error: 'User created but broker information could not be saved. Please contact support.' },
          { status: 500 }
        )
      }
    }

    console.log('✅ Registration successful for:', result.user.username)
    return NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
      message: role === 'broker' ? 'Broker registration successful! Your account is pending admin approval.' : 'Registration successful!'
    })

  } catch (error) {
    console.error('❌ Register API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}