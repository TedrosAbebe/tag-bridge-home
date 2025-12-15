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

// GET - Fetch all guest submissions (admin only)
export async function GET(request: NextRequest) {
  console.log('📋 ADMIN GUEST SUBMISSIONS API CALLED')
  
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const dbPath = join(process.cwd(), 'data', 'broker-clean.db')
    const db = new Database(dbPath)

    try {
      // Get all guest submissions with property details
      const submissions = db.prepare(`
        SELECT 
          gs.*,
          p.title,
          p.description,
          p.price,
          p.city,
          p.area,
          p.type,
          p.size,
          p.status as property_status,
          p.created_at as property_created_at,
          p.rejection_reason,
          p.admin_notes
        FROM guest_submissions gs
        JOIN properties p ON gs.property_id = p.id
        WHERE p.submitted_by = 'guest'
        ORDER BY gs.submission_date DESC
      `).all()

      console.log(`✅ Found ${submissions.length} guest submissions`)

      // Calculate stats
      const stats = submissions.reduce((acc: any, sub: any) => {
        acc.total++
        if (sub.property_status === 'pending') {
          acc.pending++
        } else if (sub.property_status === 'approved') {
          acc.approved++
        } else if (sub.property_status === 'rejected') {
          acc.rejected++
        }
        return acc
      }, { total: 0, pending: 0, approved: 0, rejected: 0 })

      return NextResponse.json({
        success: true,
        submissions: submissions,
        stats: stats
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Admin guest submissions error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}

// PUT - Update guest submission status (approve/reject)
export async function PUT(request: NextRequest) {
  console.log('🔄 ADMIN GUEST SUBMISSION UPDATE API CALLED')
  
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const data = await request.json()
    const { submissionId, propertyId, action, rejectionReason, adminNotes } = data

    if (!submissionId || !propertyId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const dbPath = join(process.cwd(), 'data', 'broker-clean.db')
    const db = new Database(dbPath)

    try {
      if (action === 'approve') {
        // Update property status to approved
        const updateProperty = db.prepare(`
          UPDATE properties 
          SET status = 'approved', admin_notes = ?
          WHERE id = ? AND submitted_by = 'guest'
        `)
        updateProperty.run(adminNotes || '', propertyId)

        // Update guest submission
        const updateSubmission = db.prepare(`
          UPDATE guest_submissions 
          SET status = 'approved', admin_notes = ?
          WHERE id = ?
        `)
        updateSubmission.run(adminNotes || '', submissionId)

        console.log('✅ Guest submission approved:', propertyId)

      } else if (action === 'reject') {
        // Update property status to rejected
        const updateProperty = db.prepare(`
          UPDATE properties 
          SET status = 'rejected', rejection_reason = ?, admin_notes = ?
          WHERE id = ? AND submitted_by = 'guest'
        `)
        updateProperty.run(rejectionReason || '', adminNotes || '', propertyId)

        // Update guest submission
        const updateSubmission = db.prepare(`
          UPDATE guest_submissions 
          SET status = 'rejected', admin_notes = ?
          WHERE id = ?
        `)
        updateSubmission.run(adminNotes || '', submissionId)

        console.log('✅ Guest submission rejected:', propertyId)

      } else {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: `Guest submission ${action}d successfully`
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Admin guest submission update error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}