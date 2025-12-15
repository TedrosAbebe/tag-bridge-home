import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

function getUserFromToken(token: string) {
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

// GET - Fetch pending payments for admin review
export async function GET(request: NextRequest) {
  console.log('💳 ADMIN PAYMENTS API CALLED')
  
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      const payments = db.prepare(`
        SELECT 
          p.*,
          pr.title as property_title,
          pr.type as property_type,
          pr.city,
          pr.area,
          pr.is_premium,
          u.username as broker_name
        FROM payments p
        LEFT JOIN properties pr ON p.property_id = pr.id
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.status = 'awaiting_payment'
        ORDER BY p.created_at DESC
      `).all()

      console.log(`✅ Found ${payments.length} pending payments`)

      return NextResponse.json({
        success: true,
        payments
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Admin payments error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Approve or reject payment
export async function PUT(request: NextRequest) {
  console.log('💳 ADMIN PAYMENT UPDATE CALLED')
  
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { paymentId, propertyId, action, adminNotes } = await request.json()

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      if (action === 'approve') {
        // Update payment status
        db.prepare(`
          UPDATE payments 
          SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(paymentId)

        // Update property status to approved
        db.prepare(`
          UPDATE properties 
          SET status = 'approved', payment_status = 'confirmed', updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(propertyId)

        console.log('✅ Payment and property approved')

      } else if (action === 'reject') {
        // Update payment status
        db.prepare(`
          UPDATE payments 
          SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(paymentId)

        // Update property status to rejected
        db.prepare(`
          UPDATE properties 
          SET status = 'rejected', payment_status = 'rejected', updated_at = CURRENT_TIMESTAMP 
          WHERE id = ?
        `).run(propertyId)

        console.log('✅ Payment and property rejected')
      }

      return NextResponse.json({
        success: true,
        message: `Payment ${action}d successfully`
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Admin payment update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}