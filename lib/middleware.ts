import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUserFromToken } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    username: string
    role: 'user' | 'broker' | 'admin'
  }
}

// Middleware to verify JWT token and attach user to request
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const authHeader = request.headers.get('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix
      const user = await getUserFromToken(token)

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        )
      }

      // Attach user to request
      const authenticatedRequest = request as AuthenticatedRequest
      authenticatedRequest.user = user

      return handler(authenticatedRequest)
    } catch (error) {
      console.error('Authentication middleware error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }
  }
}

// Middleware to verify admin role
export function withAdminAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (request: AuthenticatedRequest): Promise<NextResponse> => {
    if (request.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return handler(request)
  })
}

// Middleware to verify broker role
export function withBrokerAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (request: AuthenticatedRequest): Promise<NextResponse> => {
    if (request.user?.role !== 'broker' && request.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Broker access required' },
        { status: 403 }
      )
    }

    return handler(request)
  })
}