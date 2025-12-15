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

// GET - Fetch all properties for admin review
export async function GET(request: NextRequest) {
  console.log('👑 ADMIN PROPERTIES API CALLED')
  
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    console.log('✅ Admin authenticated:', user.username)

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      // Get all properties with owner information
      const properties = db.prepare(`
        SELECT 
          p.*,
          u.username as owner_name,
          u.role as owner_role
        FROM properties p
        LEFT JOIN users u ON p.owner_id = u.id
        ORDER BY p.created_at DESC
      `).all()

      console.log('✅ Found', properties.length, 'properties for admin review')

      return NextResponse.json({
        success: true,
        properties
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Admin properties error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Update property status (approve/reject)
export async function PUT(request: NextRequest) {
  console.log('👑 ADMIN PROPERTY UPDATE API CALLED')
  
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { propertyId, status, adminNotes } = await request.json()
    
    if (!propertyId || !status) {
      return NextResponse.json({ error: 'Property ID and status required' }, { status: 400 })
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    console.log('👑 Admin', user.username, 'updating property', propertyId, 'to', status)

    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      // Update property status
      const updateResult = db.prepare(`
        UPDATE properties 
        SET status = ?
        WHERE id = ?
      `).run(status, propertyId)

      if (updateResult.changes === 0) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }

      // Get updated property
      const updatedProperty = db.prepare(`
        SELECT 
          p.*,
          u.username as owner_name
        FROM properties p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.id = ?
      `).get(propertyId)

      console.log('✅ Property status updated successfully')

      return NextResponse.json({
        success: true,
        message: `Property ${status} successfully`,
        property: updatedProperty
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Admin property update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Permanently delete a property or bulk delete
export async function DELETE(request: NextRequest) {
  console.log('👑 ADMIN PROPERTY DELETE API CALLED')
  
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { propertyId, bulkDelete, deleteType, adminNotes } = await request.json()
    
    const dbPath = join(process.cwd(), 'data', 'broker.db')
    const db = new Database(dbPath)

    try {
      // Handle bulk delete operations
      if (bulkDelete) {
        console.log('👑 Admin', user.username, 'performing bulk delete:', deleteType)
        
        let deleteQuery = ''
        let deletedCount = 0
        
        if (deleteType === 'broker_properties') {
          // Delete all properties from broker users
          const brokerProperties = db.prepare(`
            SELECT p.id, p.title FROM properties p
            LEFT JOIN users u ON p.owner_id = u.id
            WHERE u.role = 'broker'
          `).all()
          const brokerPropertiesAny = brokerProperties as any[]
          
          deletedCount = brokerProperties.length
          
          // Delete related records first
          for (const prop of brokerPropertiesAny) {
            try {
              db.prepare('DELETE FROM payments WHERE property_id = ?').run(prop.id)
            } catch (error) {
              console.log('⚠️ No payments to delete for property:', prop.id)
            }
          }
          
          // Delete broker properties
          db.prepare(`
            DELETE FROM properties 
            WHERE owner_id IN (SELECT id FROM users WHERE role = 'broker')
          `).run()
          
        } else if (deleteType === 'all_properties') {
          // Get count first
          const allProperties = db.prepare('SELECT COUNT(*) as count FROM properties').get() as any
          deletedCount = allProperties.count
          
          // Delete all related records first
          try {
            db.prepare('DELETE FROM payments').run()
            console.log('✅ Deleted all payments')
          } catch (error) {
            console.log('⚠️ No payments table or no payments to delete')
          }
          
          try {
            db.prepare('DELETE FROM property_images').run()
            console.log('✅ Deleted all property images')
          } catch (error) {
            console.log('⚠️ No property_images table')
          }
          
          try {
            db.prepare('DELETE FROM favorites').run()
            console.log('✅ Deleted all favorites')
          } catch (error) {
            console.log('⚠️ No favorites table')
          }
          
          // Delete all properties
          db.prepare('DELETE FROM properties').run()
        }
        
        console.log(`✅ Bulk delete completed: ${deletedCount} properties deleted`)
        
        // Log the bulk deletion
        try {
          db.prepare(`
            INSERT INTO admin_logs (admin_id, action, details, created_at)
            VALUES (?, ?, ?, datetime('now'))
          `).run(user.id || 'unknown', 'BULK_DELETE_PROPERTIES', `Bulk deleted ${deletedCount} properties (${deleteType})`)
        } catch (logError) {
          console.log('⚠️ Admin logs table does not exist, skipping logging...')
        }

        return NextResponse.json({
          success: true,
          message: `Successfully deleted ${deletedCount} properties`,
          deletedCount
        })
      }
      
      // Handle single property delete (existing code)
      if (!propertyId) {
        return NextResponse.json({ error: 'Property ID required for single delete' }, { status: 400 })
      }

      console.log('👑 Admin', user.username, 'deleting property', propertyId)

      // First, get the property details for logging
      const property = db.prepare(`
        SELECT 
          p.*,
          u.username as owner_name
        FROM properties p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.id = ?
      `).get(propertyId) as any

      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 })
      }

      // Delete related records first
      try {
        db.prepare('DELETE FROM payments WHERE property_id = ?').run(propertyId)
      } catch (error) {
        console.log('⚠️ No payments to delete for this property')
      }
      
      try {
        db.prepare('DELETE FROM property_images WHERE property_id = ?').run(propertyId)
      } catch (error) {
        console.log('⚠️ property_images table does not exist, skipping...')
      }
      
      try {
        db.prepare('DELETE FROM favorites WHERE property_id = ?').run(propertyId)
      } catch (error) {
        console.log('⚠️ favorites table does not exist, skipping...')
      }
      
      // Delete the property itself
      const deleteResult = db.prepare('DELETE FROM properties WHERE id = ?').run(propertyId)

      if (deleteResult.changes === 0) {
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
      }

      console.log('✅ Property deleted successfully:', property.title)

      // Log the deletion
      try {
        db.prepare(`
          INSERT INTO admin_logs (admin_id, action, details, created_at)
          VALUES (?, ?, ?, datetime('now'))
        `).run(user.id || 'unknown', 'DELETE_PROPERTY', `Deleted property: ${property.title} (ID: ${propertyId})`)
        console.log('✅ Admin action logged successfully')
      } catch (logError) {
        console.log('⚠️ Admin logs table does not exist, skipping logging...')
      }

      return NextResponse.json({
        success: true,
        message: `Property "${property.title}" deleted successfully`,
        deletedProperty: {
          id: property.id,
          title: property.title,
          owner: property.owner_name
        }
      })

    } finally {
      db.close()
    }

  } catch (error) {
    console.error('❌ Admin property delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}