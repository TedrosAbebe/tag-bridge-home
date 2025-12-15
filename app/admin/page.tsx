'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '../components/Navigation'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  HomeIcon,
  UsersIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface Payment {
  id: string
  amount: number
  payment_type: string
  status: string
  property_title: string
  user_name: string
  user_phone: string
  created_at: string
}

interface Property {
  id: string
  title: string
  status: string
  price: number
  currency: string
  city: string
  area: string
  owner_name: string
  created_at: string
}

interface User {
  id: string
  name: string
  phone: string
  whatsapp_number: string
  role: string
  created_at: string
}

interface AdminLog {
  id: string
  admin_name: string
  action: string
  target_type: string
  target_id: string
  details: string
  created_at: string
}

interface DashboardStats {
  overview: {
    totalUsers: number
    totalProperties: number
    totalRevenue: number
    pendingPayments: number
    pendingProperties: number
  }
  userStats: Record<string, number>
  propertyStats: Record<string, { count: number; avgPrice: number }>
  paymentStats: Record<string, { count: number; totalAmount: number }>
  recentActivity: {
    newUsers: number
    newProperties: number
    newPayments: number
  }
}

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { t, language } = useLanguage()
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'payments' | 'properties' | 'users' | 'logs'>('dashboard')
  const [payments, setPayments] = useState<Payment[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Redirect if not admin
  useEffect(() => {
    if (!user || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch dashboard stats
      const dashboardResponse = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const dashboardData = await dashboardResponse.json()
      setDashboardStats(dashboardData)
      
      // Fetch pending payments
      const paymentsResponse = await fetch('/api/admin/payments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const paymentsData = await paymentsResponse.json()
      
      // Fetch all properties
      const propertiesResponse = await fetch('/api/admin/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const propertiesData = await propertiesResponse.json()
      
      // Fetch all users
      const usersResponse = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const usersData = await usersResponse.json()
      
      // Fetch admin logs
      const logsResponse = await fetch('/api/admin/logs?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const logsData = await logsResponse.json()
      
      setPayments(paymentsData.payments || [])
      setProperties(propertiesData.properties || [])
      setUsers(usersData.users || [])
      setLogs(logsData.logs || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentAction = async (paymentId: string, action: 'confirm' | 'reject', notes?: string) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId,
          action,
          notes
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`Payment ${action}ed successfully`)
        fetchData() // Refresh data
      } else {
        alert(result.error || `Failed to ${action} payment`)
      }
    } catch (error) {
      console.error(`Error ${action}ing payment:`, error)
      alert(`Failed to ${action} payment`)
    }
  }

  const handlePropertyStatusChange = async (propertyId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/properties', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId,
          status
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Property status updated successfully')
        fetchData() // Refresh data
      } else {
        alert(result.error || 'Failed to update property status')
      }
    } catch (error) {
      console.error('Error updating property status:', error)
      alert('Failed to update property status')
    }
  }

  if (!user || user?.role !== 'admin') {
    return null
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()
      
      if (result.success) {
        alert('User deleted successfully')
        fetchData() // Refresh data
      } else {
        alert(result.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return
    
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/admin/properties?propertyId=${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()
      
      if (result.success) {
        alert('Property deleted successfully')
        fetchData() // Refresh data
      } else {
        alert(result.error || 'Failed to delete property')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Failed to delete property')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'confirmed': return 'text-green-600 bg-green-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'sold': return 'text-blue-600 bg-blue-100'
      case 'pending_payment': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100'
      case 'broker': return 'text-blue-600 bg-blue-100'
      case 'user': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)
    const matchesRole = !selectedRole || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || property.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-gray-900 mb-2 ${
            language === 'am' ? 'amharic' : ''
          }`}>
            {language === 'en' ? 'Admin Dashboard' : 'የአስተዳዳሪ ዳሽቦርድ'}
          </h1>
          <p className={`text-gray-600 ${language === 'am' ? 'amharic' : ''}`}>
            {language === 'en' 
              ? 'Manage payments and property listings'
              : 'ክፍያዎችን እና የንብረት ዝርዝሮችን ያስተዳድሩ'
            }
          </p>
        </div>

        {/* Stats Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.overview.totalUsers}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <HomeIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.overview.totalProperties}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.overview.pendingPayments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <HomeIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Properties</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.overview.pendingProperties}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.overview.totalRevenue} ETB
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-ethiopian-green text-ethiopian-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ChartBarIcon className="w-4 h-4 inline mr-1" />
                {language === 'en' ? 'Dashboard' : 'ዳሽቦርድ'}
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'payments'
                    ? 'border-ethiopian-green text-ethiopian-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                {language === 'en' ? 'Payments' : 'ክፍያዎች'}
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'properties'
                    ? 'border-ethiopian-green text-ethiopian-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <HomeIcon className="w-4 h-4 inline mr-1" />
                {language === 'en' ? 'Properties' : 'ንብረቶች'}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-ethiopian-green text-ethiopian-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <UsersIcon className="w-4 h-4 inline mr-1" />
                {language === 'en' ? 'Users' : 'ተጠቃሚዎች'}
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'logs'
                    ? 'border-ethiopian-green text-ethiopian-green'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <DocumentTextIcon className="w-4 h-4 inline mr-1" />
                {language === 'en' ? 'Activity Logs' : 'የእንቅስቃሴ ምዝገባዎች'}
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ethiopian-green mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && dashboardStats && (
                  <div className="space-y-6">
                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">New Users (30 days)</h4>
                        <p className="text-2xl font-bold text-blue-600">{dashboardStats.recentActivity.newUsers}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">New Properties (30 days)</h4>
                        <p className="text-2xl font-bold text-green-600">{dashboardStats.recentActivity.newProperties}</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">New Payments (30 days)</h4>
                        <p className="text-2xl font-bold text-purple-600">{dashboardStats.recentActivity.newPayments}</p>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-4">User Distribution</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Admins</p>
                          <p className="text-xl font-bold text-red-600">{dashboardStats.userStats.admin || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Brokers</p>
                          <p className="text-xl font-bold text-blue-600">{dashboardStats.userStats.broker || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Users</p>
                          <p className="text-xl font-bold text-green-600">{dashboardStats.userStats.user || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Property Stats */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-4">Property Status Distribution</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        {Object.entries(dashboardStats.propertyStats).map(([status, data]) => (
                          <div key={status}>
                            <p className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</p>
                            <p className="text-lg font-bold text-gray-900">{data.count}</p>
                            {data.avgPrice > 0 && (
                              <p className="text-xs text-gray-500">Avg: {Math.round(data.avgPrice)} ETB</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="space-y-4">
                    {payments.filter(p => p.status === 'pending').length === 0 ? (
                      <p className={`text-gray-600 text-center py-8 ${language === 'am' ? 'amharic' : ''}`}>
                        {language === 'en' ? 'No pending payments' : 'በመጠባበቅ ላይ ያሉ ክፍያዎች የሉም'}
                      </p>
                    ) : (
                      payments.filter(p => p.status === 'pending').map((payment) => (
                        <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{payment.property_title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {payment.user_name} • {payment.user_phone}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-lg font-bold text-ethiopian-green">
                                  {payment.amount} ETB
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                                  {payment.payment_type.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Payment ID: {payment.id}
                              </p>
                            </div>
                            
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => handlePaymentAction(payment.id, 'confirm')}
                                className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Confirm</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  const notes = prompt('Rejection reason (optional):')
                                  handlePaymentAction(payment.id, 'reject', notes || undefined)
                                }}
                                className="flex items-center space-x-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                <XCircleIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Reject</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'properties' && (
                  <div className="space-y-4">
                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search properties..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ethiopian-green"
                        />
                      </div>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ethiopian-green"
                      >
                        <option value="">All Status</option>
                        <option value="pending_payment">Pending Payment</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="sold">Sold</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    {filteredProperties.length === 0 ? (
                      <p className={`text-gray-600 text-center py-8 ${language === 'am' ? 'amharic' : ''}`}>
                        {language === 'en' ? 'No properties found' : 'ምንም ንብረት አልተገኘም'}
                      </p>
                    ) : (
                      filteredProperties.map((property) => (
                        <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{property.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {property.area}, {property.city} • {property.owner_name}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-lg font-bold text-ethiopian-green">
                                  {new Intl.NumberFormat().format(property.price)} {property.currency}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                                  {property.status.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Created: {new Date(property.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <select
                                value={property.status}
                                onChange={(e) => handlePropertyStatusChange(property.id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="pending_payment">Pending Payment</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="sold">Sold</option>
                                <option value="rejected">Rejected</option>
                              </select>
                              
                              <button
                                onClick={() => handleDeleteProperty(property.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Property"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="space-y-4">
                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ethiopian-green"
                        />
                      </div>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ethiopian-green"
                      >
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="broker">Broker</option>
                        <option value="user">User</option>
                      </select>
                    </div>

                    {filteredUsers.length === 0 ? (
                      <p className={`text-gray-600 text-center py-8 ${language === 'am' ? 'amharic' : ''}`}>
                        {language === 'en' ? 'No users found' : 'ምንም ተጠቃሚ አልተገኘም'}
                      </p>
                    ) : (
                      filteredUsers.map((user) => (
                        <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {user.phone} • {user.whatsapp_number}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Joined: {new Date(user.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => {
                                  // TODO: Implement edit user modal
                                  alert('Edit user functionality coming soon')
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit User"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              
                              {user.id !== user?.id && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'logs' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Showing recent admin activity logs
                    </div>
                    
                    {logs.length === 0 ? (
                      <p className={`text-gray-600 text-center py-8 ${language === 'am' ? 'amharic' : ''}`}>
                        {language === 'en' ? 'No activity logs found' : 'ምንም የእንቅስቃሴ ምዝገባ አልተገኘም'}
                      </p>
                    ) : (
                      logs.map((log) => (
                        <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900">{log.admin_name}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm font-medium text-blue-600">{log.action.replace('_', ' ')}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">{log.target_type}</span>
                              </div>
                              {log.details && (
                                <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                              )}
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}