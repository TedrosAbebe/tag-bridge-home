import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../../lib/auth'
import { brokerOperations, userOperations } from '../../../../lib/supabase-database'

export async function GET(request: NextRequest) {
  console.log('🏢 Admin broker applications API called')
  
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header')
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      console.log('❌ Invalid token or not admin')
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all broker applications
    const applications = await brokerOperations.getAll()
    
    console.log('✅ Retrieved broker applications:', applications.length)
    return NextResponse.json({
      success: true,
      applications
    })

  } catch (error) {
    console.error('❌ Admin broker applications API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  console.log('🏢 Admin broker application update API called')
  
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header')
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      console.log('❌ Invalid token or not admin')
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, status, rejectionReason, adminNotes } = body
    
    console.log('🏢 Broker application update request:', { userId, status })

    if (!userId || !status) {
      return NextResponse.json(
        { success: false, error: 'User ID and status are required' },
        { status: 400 }
      )
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be approved or rejected' },
        { status: 400 }
      )
    }

    // Update broker application status
    await brokerOperations.updateStatus(userId, status)
    
    // If approved, ensure user role is set to broker
    if (status === 'approved') {
      const user = await userOperations.findById(userId)
      if (user) {
        await userOperations.update(userId, user.username, 'broker')
        console.log('✅ User role updated to broker:', user.username)
      }
    }
    
    console.log('✅ Broker application updated successfully')
    return NextResponse.json({
      success: true,
      message: `Broker application ${status} successfully`
    })

  } catch (error) {
    console.error('❌ Admin broker application update API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  console.log('🗑️ Admin broker deletion API called')
  
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header')
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (!decoded || decoded.role !== 'admin') {
      console.log('❌ Invalid token or not admin')
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, deleteAccount, bulkDelete, deleteType } = body
    
    console.log('🗑️ Broker deletion request:', { userId, deleteAccount, bulkDelete, deleteType })

    // Handle bulk deletion
    if (bulkDelete) {
      let deletedCount = 0
      
      if (deleteType === 'rejected') {
        // Get all rejected broker applications
        const rejectedBrokers = await brokerOperations.getRejected()
        
        for (const broker of rejectedBrokers) {
          try {
            // Delete user account (will cascade delete broker_info)
            await userOperations.delete(broker.user_id)
            
            deletedCount++
            console.log('✅ Deleted rejected broker:', broker.full_name)
          } catch (error) {
            console.log('⚠️ Failed to delete broker:', broker.full_name, error)
          }
        }
      } else if (deleteType === 'all') {
        // Get all broker applications
        const allBrokers = await brokerOperations.getAll()
        
        for (const broker of allBrokers) {
          try {
            // Delete user account (will cascade delete broker_info)
            await userOperations.delete(broker.user_id)
            
            deletedCount++
            console.log('✅ Deleted broker:', broker.full_name)
          } catch (error) {
            console.log('⚠️ Failed to delete broker:', broker.full_name, error)
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Bulk deleted ${deletedCount} broker applications`,
        deletedCount: deletedCount
      })
    }

    // Handle single deletion
    if (!userId) {
      console.log('❌ No user ID provided')
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get broker info before deletion
    const brokerInfo = await brokerOperations.findByUserId(userId)
    
    if (!brokerInfo) {
      console.log('❌ Broker info not found for user ID:', userId)
      return NextResponse.json(
        { success: false, message: 'Broker application not found' },
        { status: 404 }
      )
    }

    console.log('✅ Found broker info:', brokerInfo.full_name)

    // If deleteAccount is true, also delete the user account
    if (deleteAccount) {
      console.log('🗑️ Deleting user account for:', brokerInfo.full_name)
      
      try {
        // Delete user account (this will cascade delete broker_info due to foreign key)
        await userOperations.delete(userId)
        console.log('✅ User account deleted:', userId)
      } catch (error) {
        console.log('❌ Error deleting user account:', error)
        return NextResponse.json(
          { success: false, message: 'Failed to delete user account' },
          { status: 500 }
        )
      }
    } else {
      // Just delete broker info, keep user account
      try {
        await brokerOperations.delete(userId)
        console.log('✅ Broker info deleted, user account preserved')
      } catch (error) {
        console.log('❌ Error deleting broker info:', error)
        return NextResponse.json(
          { success: false, message: 'Failed to delete broker application' },
          { status: 500 }
        )
      }
    }

    const successMessage = deleteAccount 
      ? `Broker "${brokerInfo.full_name}" and user account deleted successfully`
      : `Broker application for "${brokerInfo.full_name}" deleted successfully`
    
    console.log('✅', successMessage)
    
    return NextResponse.json({
      success: true,
      message: successMessage
    })

  } catch (error) {
    console.error('❌ Admin broker deletion API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}