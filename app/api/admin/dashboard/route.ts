import { NextRequest, NextResponse } from 'next/server'
import { userOperations } from '../../../../lib/supabase-database'
import { getUserFromToken } from '../../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await getUserFromToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all users for statistics
    const allUsers = await userOperations.getAll()
    
    // Calculate user statistics
    const userStatsMap = allUsers.reduce((acc: any, user: any) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {})

    // Mock property data to match admin properties API
    const mockProperties = [
      { status: 'approved', price: 5000000 },
      { status: 'pending', price: 180000 },
      { status: 'rejected', price: 3500000 }
    ]

    const propertyStatsMap = mockProperties.reduce((acc: any, prop: any) => {
      if (!acc[prop.status]) {
        acc[prop.status] = { count: 0, totalPrice: 0 }
      }
      acc[prop.status].count++
      acc[prop.status].totalPrice += prop.price
      acc[prop.status].avgPrice = acc[prop.status].totalPrice / acc[prop.status].count
      return acc
    }, {})

    const paymentStatsMap = {
      pending: { count: 1, totalAmount: 50 },
      confirmed: { count: 2, totalAmount: 75 },
      rejected: { count: 0, totalAmount: 0 }
    }

    // Calculate totals
    const totalUsers = allUsers.length
    const totalProperties = mockProperties.length
    const totalRevenue = paymentStatsMap.confirmed.totalAmount

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentUsers = allUsers
      .filter((u: any) => new Date(u.created_at) > thirtyDaysAgo)
      .length

    const recentProperties = 2 // Mock data - recent properties
    const recentPayments = 1 // Mock data - recent payments

    return NextResponse.json({
      overview: {
        totalUsers,
        totalProperties,
        totalRevenue,
        pendingPayments: paymentStatsMap.pending?.count || 0,
        pendingProperties: propertyStatsMap.pending?.count || 0
      },
      userStats: userStatsMap,
      propertyStats: propertyStatsMap,
      paymentStats: paymentStatsMap,
      recentActivity: {
        newUsers: recentUsers,
        newProperties: recentProperties,
        newPayments: recentPayments
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}