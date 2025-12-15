import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from './auth'

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    return await getUserFromToken(token)
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }
  
  return user
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request)
  
  if (user instanceof NextResponse) {
    return user // Return the error response
  }
  
  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    )
  }
  
  return user
}

export async function requireBroker(request: NextRequest) {
  const user = await requireAuth(request)
  
  if (user instanceof NextResponse) {
    return user // Return the error response
  }
  
  if (user.role !== 'broker' && user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Broker access required' },
      { status: 403 }
    )
  }
  
  return user
}