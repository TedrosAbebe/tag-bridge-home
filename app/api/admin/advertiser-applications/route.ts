import { NextRequest, NextResponse } from 'next/server'
import Database from 'better-sqlite3'
import { join } from 'path'

export async function GET(request: NextRequest) {
  try {
    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)
    
    // Get all advertiser applications
    const applications = db.prepare(`
      SELECT * FROM advertiser_applications 
      ORDER BY created_at DESC
    `).all()

    db.close()

    return NextResponse.json({
      success: true,
      applications: applications
    })

  } catch (error) {
    console.error('Error fetching advertiser applications:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { applicationId, status, reviewedBy } = await request.json()
    
    if (!applicationId || !status || !reviewedBy) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      )
    }

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)
    
    // Update application status
    const updateStmt = db.prepare(`
      UPDATE advertiser_applications 
      SET status = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
      WHERE id = ?
    `)

    const result = updateStmt.run(status, reviewedBy, applicationId)

    if (result.changes === 0) {
      db.close()
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      )
    }

    // If approved, create user account
    if (status === 'approved') {
      const application = db.prepare('SELECT * FROM advertiser_applications WHERE id = ?').get(applicationId) as any
      
      if (application) {
        // Create user account with advertiser role
        const userId = `advertiser_${Date.now()}`
        const username = application.email // Use email as username
        const defaultPassword = 'advertiser123' // They should change this on first login
        
        // Hash password (simple hash for demo - use proper bcrypt in production)
        const crypto = require('crypto')
        const passwordHash = crypto.createHash('sha256').update(defaultPassword).digest('hex')
        
        // Insert into users table
        const insertUserStmt = db.prepare(`
          INSERT INTO users (id, username, password_hash, role)
          VALUES (?, ?, ?, 'advertiser')
        `)
        
        try {
          insertUserStmt.run(userId, username, passwordHash)
        } catch (userError) {
          console.error('Error creating user account:', userError)
          // Continue even if user creation fails
        }
      }
    }

    db.close()

    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`
    })

  } catch (error) {
    console.error('Error updating advertiser application:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  console.log('🗑️ DELETE advertiser application API called')
  
  try {
    const body = await request.json()
    const { applicationId, deleteAccount, bulkDelete, deleteType } = body
    
    console.log('🗑️ Delete request:', { applicationId, deleteAccount, bulkDelete, deleteType })
    
    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)
    
    // Handle bulk deletion
    if (bulkDelete) {
      let applications: any[] = []
      
      if (deleteType === 'rejected') {
        applications = db.prepare('SELECT * FROM advertiser_applications WHERE status = "rejected"').all()
      } else if (deleteType === 'all') {
        applications = db.prepare('SELECT * FROM advertiser_applications').all()
      }
      
      let deletedCount = 0
      
      for (const application of applications) {
        // Delete user account and properties if they exist
        const appData = application as any
        const user = db.prepare('SELECT * FROM users WHERE username = ? AND role = "advertiser"').get(appData.email) as any
        
        if (user) {
          // Delete advertiser properties
          try {
            const deletePropertiesStmt = db.prepare('DELETE FROM properties WHERE owner_id = ? AND owner_role = "advertiser"')
            deletePropertiesStmt.run(user.id)
          } catch (error) {
            console.log('No properties to delete for user:', user.id)
          }
          
          // Delete user account
          const deleteUserStmt = db.prepare('DELETE FROM users WHERE id = ?')
          deleteUserStmt.run(user.id)
        }
        
        // Delete application
        const deleteAppStmt = db.prepare('DELETE FROM advertiser_applications WHERE id = ?')
        const result = deleteAppStmt.run(appData.id)
        
        if (result.changes > 0) {
          deletedCount++
        }
      }
      
      db.close()
      
      return NextResponse.json({
        success: true,
        message: `Bulk deleted ${deletedCount} advertiser applications`,
        deletedCount: deletedCount
      })
    }
    
    // Handle single deletion
    if (!applicationId) {
      console.log('❌ No application ID provided')
      db.close()
      return NextResponse.json(
        { success: false, message: 'Application ID is required' },
        { status: 400 }
      )
    }
    
    console.log('🔍 Looking for application:', applicationId)
    
    // Get application details before deletion
    const application = db.prepare('SELECT * FROM advertiser_applications WHERE id = ?').get(applicationId) as any
    
    if (!application) {
      console.log('❌ Application not found:', applicationId)
      db.close()
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      )
    }
    
    console.log('✅ Found application:', application.full_name, application.email)

    // If deleteAccount is true, also delete the user account and properties
    if (deleteAccount) {
      console.log('🔍 Looking for user account with email:', application.email)
      
      // Find and delete user account (using email as username)
      const user = db.prepare('SELECT * FROM users WHERE username = ? AND role = "advertiser"').get(application.email) as any
      
      if (user) {
        console.log('✅ Found user account:', user.username)
        
        // Delete advertiser properties first (if properties table exists)
        try {
          const deletePropertiesStmt = db.prepare('DELETE FROM properties WHERE owner_id = ? AND owner_role = "advertiser"')
          const propertiesDeleted = deletePropertiesStmt.run(user.id)
          console.log(`🗑️ Deleted ${propertiesDeleted.changes} advertiser properties`)
        } catch (error) {
          console.log('ℹ️ No properties table or no properties to delete:', error)
        }
        
        // Delete user account
        try {
          const deleteUserStmt = db.prepare('DELETE FROM users WHERE id = ?')
          deleteUserStmt.run(user.id)
          console.log(`✅ Deleted user account: ${user.username}`)
        } catch (error) {
          console.log('❌ Error deleting user account:', error)
        }
      } else {
        console.log('ℹ️ No user account found for email:', application.email)
      }
    }
    
    // Delete the application
    console.log('🗑️ Deleting application from database...')
    const deleteAppStmt = db.prepare('DELETE FROM advertiser_applications WHERE id = ?')
    const result = deleteAppStmt.run(applicationId)
    
    console.log('🗑️ Delete result:', result.changes, 'rows affected')
    
    db.close()

    if (result.changes === 0) {
      console.log('❌ No rows were deleted')
      return NextResponse.json(
        { success: false, message: 'Failed to delete application' },
        { status: 500 }
      )
    }

    const successMessage = deleteAccount 
      ? 'Advertiser application and account deleted successfully'
      : 'Advertiser application deleted successfully'
    
    console.log('✅', successMessage)
    
    return NextResponse.json({
      success: true,
      message: successMessage
    })

  } catch (error) {
    console.error('Error deleting advertiser application:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}