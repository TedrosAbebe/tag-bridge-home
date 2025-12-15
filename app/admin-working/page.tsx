'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'
import { 
  HomeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  UserIcon,
  TrashIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface Property {
  id: string
  title: string
  price: number
  city: string
  area: string
  type: string
  size: number
  status: string
  owner_name: string
  owner_role: string
  whatsapp_number: string
  phone_number: string
  created_at: string
}

interface GuestSubmission {
  id: string
  property_id: string
  guest_name: string
  guest_phone: string
  guest_whatsapp: string
  title: string
  description: string
  price: number
  city: string
  area: string
  type: string
  property_status: string
  submission_date: string
}

interface User {
  id: string
  username: string
  role: string
  created_at: string
  last_login?: string
}

interface BrokerApplication {
  id: string
  user_id: string
  username: string
  full_name: string
  email: string
  phone: string
  license_number?: string
  experience: string
  specialization: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user_created_at: string
}

interface AdvertiserApplication {
  id: string
  full_name: string
  email: string
  phone_number: string
  whatsapp_number?: string
  business_name: string
  business_type: string
  business_license?: string
  years_in_business?: number
  city: string
  area: string
  address?: string
  services: string
  specialization?: string
  website?: string
  social_media?: string
  description?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  reviewed_at?: string
  reviewed_by?: string
}

export default function AdminWorkingDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  
  const [properties, setProperties] = useState<Property[]>([])
  const [guestSubmissions, setGuestSubmissions] = useState<GuestSubmission[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [brokerApplications, setBrokerApplications] = useState<BrokerApplication[]>([])
  const [advertiserApplications, setAdvertiserApplications] = useState<AdvertiserApplication[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'properties' | 'guests' | 'users' | 'brokers' | 'advertisers' | 'payments' | 'manage-users' | 'banners'>('properties')
  
  // User management state
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user'
  })
  const [userManagementLoading, setUserManagementLoading] = useState(false)
  const [adminSetupComplete, setAdminSetupComplete] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({
    username: '',
    role: '',
    password: ''
  })

  // Banner management state
  const [banners, setBanners] = useState<any[]>([])
  const [bannerLoading, setBannerLoading] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any | null>(null)
  const [newBanner, setNewBanner] = useState({
    id: '',
    title_en: '',
    title_am: '',
    description_en: '',
    description_am: '',
    button_text_en: '',
    button_text_am: '',
    button_link: '',
    background_color: 'from-blue-500 to-purple-600',
    text_color: 'text-white',
    icon: '🎉',
    type: 'promotion',
    is_active: 1
  })

  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    if (user.role !== 'admin') {
      router.push('/')
      return
    }
    
    fetchProperties()
    fetchGuestSubmissions()
    fetchUsers()
    fetchBrokerApplications()
    fetchAdvertiserApplications()
    fetchPayments()
    fetchBanners()
    checkAdminSetupStatus()
  }, [user, router])

  const checkAdminSetupStatus = async () => {
    try {
      const response = await fetch('/api/admin/setup')
      const data = await response.json()
      setAdminSetupComplete(data.setupComplete)
    } catch (error) {
      console.error('Error checking admin setup status:', error)
    }
  }

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin-working/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setProperties(data.properties)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGuestSubmissions = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/guest-submissions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setGuestSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('Error fetching guest submissions:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchBrokerApplications = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/broker-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setBrokerApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching broker applications:', error)
    }
  }

  const fetchAdvertiserApplications = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/advertiser-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setAdvertiserApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching advertiser applications:', error)
    }
  }

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/payments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setPayments(data.payments)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    }
  }

  const updatePropertyStatus = async (propertyId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin-working/properties', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId,
          status,
          adminNotes: `${status} by admin`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchProperties()
        alert(`Property ${status} successfully!`)
      } else {
        alert(`Failed to ${status} property: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Error updating property')
    }
  }

  const deleteProperty = async (propertyId: string, propertyTitle: string) => {
    const confirmMessage = `Are you sure you want to permanently delete "${propertyTitle}"?\n\nThis action cannot be undone and will remove the property from the system completely.\n\nClick OK to delete or Cancel to abort.`
    
    if (!confirm(confirmMessage)) {
      alert('❌ Property deletion cancelled.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin-working/properties', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId,
          adminNotes: `Property "${propertyTitle}" deleted by admin`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchProperties()
        alert(`Property "${propertyTitle}" deleted successfully!`)
      } else {
        alert(`Failed to delete property: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Error deleting property')
    }
  }

  const updateGuestSubmissionStatus = async (submissionId: string, propertyId: string, action: string, rejectionReason?: string) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/guest-submissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          submissionId,
          propertyId,
          action,
          rejectionReason,
          adminNotes: `${action} by admin`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchGuestSubmissions()
        fetchProperties()
        alert(`Guest submission ${action}d successfully!`)
      } else {
        alert(`Failed to ${action} guest submission: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating guest submission:', error)
      alert('Error updating guest submission')
    }
  }

  const updateBrokerApplicationStatus = async (userId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/broker-applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          status,
          rejectionReason,
          adminNotes: `${status} by admin`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchBrokerApplications()
        fetchUsers()
        alert(`Broker application ${status} successfully!`)
      } else {
        alert(`Failed to ${status} broker application: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating broker application:', error)
      alert('Error updating broker application')
    }
  }

  const updateAdvertiserApplicationStatus = async (applicationId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/advertiser-applications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId,
          status,
          rejectionReason,
          reviewedBy: user?.username || 'admin'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchAdvertiserApplications()
        fetchUsers()
        alert(`Advertiser application ${status} successfully!`)
      } else {
        alert(`Failed to ${status} advertiser application: ${data.message}`)
      }
    } catch (error) {
      console.error('Error updating advertiser application:', error)
      alert('Error updating advertiser application')
    }
  }

  const updatePaymentStatus = async (paymentId: string, propertyId: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId,
          propertyId,
          action,
          adminNotes: `Payment ${action}d by admin`
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchPayments()
        fetchProperties()
        alert(`Payment ${action}d successfully! Property is now ${action === 'approve' ? 'live' : 'rejected'}.`)
      } else {
        alert(`Failed to ${action} payment: ${data.message}`)
      }
    } catch (error) {
      console.error('Error updating payment:', error)
      alert('Error updating payment')
    }
  }

  // Bulk delete functions
  const deleteAllBrokerProperties = async () => {
    const brokerProperties = properties.filter(p => p.owner_role === 'broker')
    
    if (brokerProperties.length === 0) {
      alert(language === 'en' ? 'No broker properties found to delete.' : 'ምንም የደላላ ንብረቶች አልተገኙም።')
      return
    }

    const confirmMessage = language === 'en' 
      ? `Are you sure you want to delete ALL ${brokerProperties.length} broker properties?\n\nThis action cannot be undone!\n\nClick OK to delete or Cancel to abort.`
      : `ሁሉንም ${brokerProperties.length} የደላላ ንብረቶች መሰረዝ እርግጠኛ ነዎት?\n\nይህ ድርጊት መልሶ ሊቀየር አይችልም!\n\nለመሰረዝ OK ወይም ለመሰረዝ Cancel ይጫኑ።`

    if (!confirm(confirmMessage)) {
      alert(language === 'en' ? '❌ Deletion cancelled.' : '❌ መሰረዝ ተሰርዟል።')
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin-working/properties', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bulkDelete: true,
          deleteType: 'broker_properties',
          adminNotes: 'Bulk delete all broker properties by admin'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchProperties()
        alert(`✅ Successfully deleted ${brokerProperties.length} broker properties!`)
      } else {
        alert(`❌ Failed to delete broker properties: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting broker properties:', error)
      alert('Error deleting broker properties')
    }
  }

  const deleteAllAdvertiserProperties = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // First get advertiser properties count
      const response = await fetch('/api/advertiser-properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      const advertiserCount = data.properties ? data.properties.length : 0
      
      if (advertiserCount === 0) {
        alert(language === 'en' ? 'No advertiser properties found to delete.' : 'ምንም የአስተዋዋቂ ንብረቶች አልተገኙም።')
        return
      }

      const confirmMessage = language === 'en' 
        ? `Are you sure you want to delete ALL ${advertiserCount} advertiser properties?\n\nThis action cannot be undone!`
        : `ሁሉንም ${advertiserCount} የአስተዋዋቂ ንብረቶች መሰረዝ እርግጠኛ ነዎት?\n\nይህ ድርጊት መልሶ ሊቀየር አይችልም!`

      if (!confirm(confirmMessage)) return

      const deleteResponse = await fetch('/api/advertiser-properties', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bulkDelete: true,
          adminNotes: 'Bulk delete all advertiser properties by admin'
        })
      })
      
      const deleteData = await deleteResponse.json()
      
      if (deleteData.success) {
        alert(`✅ Successfully deleted ${advertiserCount} advertiser properties!`)
      } else {
        alert(`❌ Failed to delete advertiser properties: ${deleteData.error}`)
      }
    } catch (error) {
      console.error('Error deleting advertiser properties:', error)
      alert('Error deleting advertiser properties')
    }
  }

  const deleteAllProperties = async () => {
    const totalProperties = properties.length
    
    if (totalProperties === 0) {
      alert(language === 'en' ? 'No properties found to delete.' : 'ምንም ንብረቶች አልተገኙም።')
      return
    }

    const confirmMessage = language === 'en' 
      ? `⚠️ DANGER: Delete ALL ${totalProperties} properties?\n\nThis includes:\n- Broker properties\n- Guest submissions\n- All property data\n\nThis action CANNOT be undone!\n\nType "DELETE ALL" to confirm:`
      : `⚠️ አደጋ: ሁሉንም ${totalProperties} ንብረቶች ይሰረዙ?\n\nይህ የሚያካትተው:\n- የደላላ ንብረቶች\n- የእንግዳ ማቅረቢያዎች\n- ሁሉም የንብረት መረጃ\n\nይህ ድርጊት መልሶ ሊቀየር አይችልም!\n\n"DELETE ALL" ብለው ያረጋግጡ:`

    const userInput = prompt(confirmMessage)
    
    if (userInput !== 'DELETE ALL') {
      alert('Deletion cancelled.')
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin-working/properties', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bulkDelete: true,
          deleteType: 'all_properties',
          adminNotes: 'Bulk delete ALL properties by admin'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchProperties()
        alert(`✅ Successfully deleted ALL ${totalProperties} properties!`)
      } else {
        alert(`❌ Failed to delete all properties: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting all properties:', error)
      alert('Error deleting all properties')
    }
  }

  // User Management Functions
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setUserManagementLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/manage-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create',
          username: newUser.username,
          password: newUser.password,
          role: newUser.role
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`${newUser.role} account created successfully!`)
        setNewUser({ username: '', password: '', role: 'user' })
        fetchUsers()
      } else {
        alert(`Failed to create user: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user')
    } finally {
      setUserManagementLoading(false)
    }
  }

  const deleteUser = async (username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/manage-users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`User "${username}" deleted successfully!`)
        fetchUsers()
      } else {
        alert(`Failed to delete user: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
  }

  const startEditUser = (user: User) => {
    setEditingUser(user)
    setEditForm({
      username: user.username,
      role: user.role,
      password: ''
    })
  }

  const cancelEdit = () => {
    setEditingUser(null)
    setEditForm({
      username: '',
      role: '',
      password: ''
    })
  }

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setUserManagementLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/manage-users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: editingUser.id,
          username: editForm.username,
          role: editForm.role,
          password: editForm.password || undefined
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`User updated successfully!`)
        cancelEdit()
        fetchUsers()
      } else {
        alert(`Failed to update user: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    } finally {
      setUserManagementLoading(false)
    }
  }

  // Broker Management Functions
  const deleteBrokerAccount = async (userId: string, fullName: string) => {
    const confirmMessage = language === 'en' 
      ? `⚠️ Delete broker account for "${fullName}"?\n\nThis will:\n- Remove the broker application\n- Delete the user account\n- Remove all broker properties\n\nThis action CANNOT be undone!\n\nClick OK to delete or Cancel to abort.`
      : `⚠️ የ"${fullName}" ደላላ መለያ ይሰረዝ?\n\nይህ:\n- የደላላ ማመልከቻን ያስወግዳል\n- የተጠቃሚ መለያን ይሰርዛል\n- ሁሉንም የደላላ ንብረቶች ያስወግዳል\n\nይህ ድርጊት መልሶ ሊቀየር አይችልም!\n\nለመሰረዝ OK ወይም ለመሰረዝ Cancel ይጫኑ።`

    if (!confirm(confirmMessage)) {
      alert(language === 'en' ? '❌ Deletion cancelled.' : '❌ መሰረዝ ተሰርዟል።')
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/broker-applications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          deleteAccount: true
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(language === 'en' 
          ? `✅ Broker account for "${fullName}" deleted successfully!`
          : `✅ የ"${fullName}" ደላላ መለያ በተሳካ ሁኔታ ተሰርዟል!`
        )
        fetchBrokerApplications()
        fetchUsers() // Refresh users list
        fetchProperties() // Refresh properties list
      } else {
        alert(`❌ Failed to delete broker account: ${data.message}`)
      }
    } catch (error) {
      console.error('Error deleting broker account:', error)
      alert('Error deleting broker account')
    }
  }

  const bulkDeleteBrokers = async (type: 'rejected' | 'all') => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/broker-applications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bulkDelete: true,
          deleteType: type
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(language === 'en' 
          ? `✅ Successfully deleted ${data.deletedCount} broker applications!`
          : `✅ ${data.deletedCount} የደላላ ማመልከቻዎች በተሳካ ሁኔታ ተሰርዘዋል!`
        )
        fetchBrokerApplications()
        fetchUsers()
        fetchProperties()
      } else {
        alert(`❌ Failed to delete applications: ${data.message}`)
      }
    } catch (error) {
      console.error('Error bulk deleting brokers:', error)
      alert('Error deleting broker applications')
    }
  }

  // Advertiser Management Functions
  const deleteAdvertiserAccount = async (applicationId: string, fullName: string) => {
    const confirmMessage = language === 'en' 
      ? `⚠️ Delete advertiser account for "${fullName}"?\n\nThis will:\n- Remove the advertiser application\n- Delete the user account if created\n- Remove all advertiser properties\n\nThis action CANNOT be undone!\n\nClick OK to delete or Cancel to abort.`
      : `⚠️ የ"${fullName}" አስተዋዋቂ መለያ ይሰረዝ?\n\nይህ:\n- የአስተዋዋቂ ማመልከቻን ያስወግዳል\n- የተፈጠረ የተጠቃሚ መለያን ይሰርዛል\n- ሁሉንም የአስተዋዋቂ ንብረቶች ያስወግዳል\n\nይህ ድርጊት መልሶ ሊቀየር አይችልም!\n\nለመሰረዝ OK ወይም ለመሰረዝ Cancel ይጫኑ።`

    if (!confirm(confirmMessage)) {
      alert(language === 'en' ? '❌ Deletion cancelled.' : '❌ መሰረዝ ተሰርዟል።')
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/advertiser-applications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId: applicationId,
          deleteAccount: true
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(language === 'en' 
          ? `✅ Advertiser account for "${fullName}" deleted successfully!`
          : `✅ የ"${fullName}" አስተዋዋቂ መለያ በተሳካ ሁኔታ ተሰርዟል!`
        )
        fetchAdvertiserApplications()
        fetchUsers() // Refresh users list
        fetchProperties() // Refresh properties list
      } else {
        alert(`❌ Failed to delete advertiser account: ${data.message}`)
      }
    } catch (error) {
      console.error('Error deleting advertiser account:', error)
      alert('Error deleting advertiser account')
    }
  }

  const bulkDeleteAdvertisers = async (type: 'rejected' | 'all') => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/advertiser-applications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bulkDelete: true,
          deleteType: type
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(language === 'en' 
          ? `✅ Successfully deleted ${data.deletedCount} advertiser applications!`
          : `✅ ${data.deletedCount} የአስተዋዋቂ ማመልከቻዎች በተሳካ ሁኔታ ተሰርዘዋል!`
        )
        fetchAdvertiserApplications()
        fetchUsers()
        fetchProperties()
      } else {
        alert(`❌ Failed to delete applications: ${data.message}`)
      }
    } catch (error) {
      console.error('Error bulk deleting advertisers:', error)
      alert('Error deleting advertiser applications')
    }
  }

  // Banner management functions
  const fetchBanners = async () => {
    try {
      setBannerLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/banners', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setBanners(data.banners)
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setBannerLoading(false)
    }
  }

  const createBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    setBannerLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBanner)
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(language === 'en' ? 'Banner created successfully!' : 'ባነር በተሳካ ሁኔታ ተፈጠረ!')
        setNewBanner({
          id: '',
          title_en: '',
          title_am: '',
          description_en: '',
          description_am: '',
          button_text_en: '',
          button_text_am: '',
          button_link: '',
          background_color: 'from-blue-500 to-purple-600',
          text_color: 'text-white',
          icon: '🎉',
          type: 'promotion',
          is_active: 1
        })
        fetchBanners()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating banner:', error)
      alert('Error creating banner')
    } finally {
      setBannerLoading(false)
    }
  }

  const updateBanner = async (banner: any) => {
    setBannerLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(banner)
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(language === 'en' ? 'Banner updated successfully!' : 'ባነር በተሳካ ሁኔታ ተዘምኗል!')
        setEditingBanner(null)
        fetchBanners()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating banner:', error)
      alert('Error updating banner')
    } finally {
      setBannerLoading(false)
    }
  }

  const deleteBanner = async (bannerId: string) => {
    if (!confirm(language === 'en' ? 'Are you sure you want to delete this banner?' : 'ይህን ባነር መሰረዝ እርግጠኛ ነዎት?')) {
      return
    }

    setBannerLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/admin/banners?id=${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(language === 'en' ? 'Banner deleted successfully!' : 'ባነር በተሳካ ሁኔታ ተሰርዟል!')
        fetchBanners()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Error deleting banner')
    } finally {
      setBannerLoading(false)
    }
  }

  const toggleBannerStatus = async (bannerId: string, currentStatus: number) => {
    const banner = banners.find(b => b.id === bannerId)
    if (!banner) return

    const updatedBanner = {
      ...banner,
      is_active: currentStatus === 1 ? 0 : 1
    }

    await updateBanner(updatedBanner)
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🛡️ {t('admin_dashboard')}
            </h1>
            <p className="text-gray-600">
              {language === 'en' 
                ? 'Manage property listings, guest submissions, and system users'
                : 'የንብረት ዝርዝሮችን፣ የእንግዳ ማቅረቢያዎችን እና የስርዓት ተጠቃሚዎችን ያስተዳድሩ'
              }
            </p>
          </div>
          
          {/* Language Toggle */}
          <LanguageToggle variant="admin" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <HomeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('total_properties')}</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('pending_properties')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.status === 'pending' || p.status === 'pending_payment').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('guest_submissions')}</p>
                <p className="text-2xl font-bold text-gray-900">{guestSubmissions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('broker_applications')}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {brokerApplications.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('total_users')}</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{language === 'en' ? 'Pending Payments' : 'በመጠባበቅ ላይ ያሉ ክፍያዎች'}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'awaiting_payment').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'properties'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🏠 {t('property_listings')} ({properties.filter(p => p.status === 'pending' || p.status === 'pending_payment').length} {t('pending')})
              </button>
              <button
                onClick={() => setActiveTab('guests')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'guests'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                👥 {t('guest_submissions')} ({guestSubmissions.filter(g => g.property_status === 'pending').length} {t('pending')})
              </button>
              <button
                onClick={() => setActiveTab('brokers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'brokers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🏢 {t('broker_applications')} ({brokerApplications.filter(b => b.status === 'pending').length} {t('pending')})
              </button>
              <button
                onClick={() => setActiveTab('advertisers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'advertisers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📢 {language === 'en' ? 'Advertiser Applications' : 'የአስተዋዋቂ ማመልከቻዎች'} ({advertiserApplications.filter(a => a.status === 'pending').length} {t('pending')})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                👨‍💼 {t('all_users')} ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'payments'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                💳 {language === 'en' ? 'Payment Confirmations' : 'የክፍያ ማረጋገጫዎች'} ({payments.filter(p => p.status === 'awaiting_payment').length})
              </button>
              <button
                onClick={() => setActiveTab('manage-users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'manage-users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                ⚙️ {t('manage_users')}
              </button>
              <button
                onClick={() => setActiveTab('banners')}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'banners'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                📢 {language === 'en' ? 'Banners' : 'ባነሮች'}
              </button>
            </nav>
          </div>
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('broker_property_listings')}
                </h2>
                
                {/* Bulk Delete Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={deleteAllBrokerProperties}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center"
                  >
                    🗑️ {language === 'en' ? 'Delete All Broker Properties' : 'ሁሉንም የደላላ ንብረቶች ሰርዝ'}
                  </button>
                  
                  <button
                    onClick={deleteAllAdvertiserProperties}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm flex items-center"
                  >
                    🗑️ {language === 'en' ? 'Delete All Advertiser Properties' : 'ሁሉንም የአስተዋዋቂ ንብረቶች ሰርዝ'}
                  </button>
                  
                  <button
                    onClick={deleteAllProperties}
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors text-sm flex items-center border-2 border-red-600"
                  >
                    ⚠️ {language === 'en' ? 'Delete ALL Properties' : 'ሁሉንም ንብረቶች ሰርዝ'}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">{t('loading')} {t('property_listings').toLowerCase()}...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-8">
                  <HomeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'en' ? 'No properties yet' : 'እስካሁን ንብረቶች የሉም'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' 
                      ? 'Property listings will appear here for review'
                      : 'የንብረት ዝርዝሮች ለግምገማ እዚህ ይታያሉ'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{property.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {property.area}, {property.city} • {property.type}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-lg font-bold text-green-600">
                              {new Intl.NumberFormat().format(property.price)} ETB
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              property.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                              property.status === 'approved' ? 'text-green-600 bg-green-100' :
                              'text-red-600 bg-red-100'
                            }`}>
                              {property.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="ml-4 flex flex-col space-y-2">
                          {/* Action buttons for pending properties */}
                          {(property.status === 'pending_payment' || property.status === 'pending') && (
                            <>
                              <button
                                onClick={() => updatePropertyStatus(property.id, 'approved')}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                ✅ {t('approve')}
                              </button>
                              <button
                                onClick={() => {
                                  const confirmMessage = language === 'en' 
                                    ? 'Are you sure you want to reject this property?'
                                    : 'ይህንን ንብረት ውድቅ ማድረግ እርግጠኛ ነዎት?'
                                  if (confirm(confirmMessage)) {
                                    updatePropertyStatus(property.id, 'rejected')
                                  }
                                }}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <XCircleIcon className="w-4 h-4 mr-2" />
                                ❌ {t('reject')}
                              </button>
                            </>
                          )}
                          
                          {/* Status display for approved properties */}
                          {property.status === 'approved' && (
                            <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-lg mb-2">
                              <span className="text-sm font-medium">✅ Approved & Live</span>
                            </div>
                          )}
                          
                          {/* Status display for rejected properties */}
                          {property.status === 'rejected' && (
                            <div className="flex items-center px-3 py-2 bg-red-100 text-red-800 rounded-lg mb-2">
                              <span className="text-sm font-medium">❌ Rejected</span>
                            </div>
                          )}
                          
                          {/* Common action buttons for all properties */}
                          <button
                            onClick={() => {
                              const propertyUrl = `${window.location.origin}/property/${property.id}`
                              navigator.clipboard.writeText(propertyUrl)
                              const message = language === 'en' 
                                ? 'Property URL copied to clipboard!'
                                : 'የንብረት ዩአርኤል ወደ ክሊፕቦርድ ተቀድቷል!'
                              alert(message)
                            }}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <EyeIcon className="w-4 h-4 mr-2" />
                            👁️ {t('view')}
                          </button>
                          
                          {/* Delete button for all properties */}
                          <button
                            onClick={() => deleteProperty(property.id, property.title)}
                            className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors border-2 border-red-600"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            🗑️ {t('delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guest Submissions Tab */}
        {activeTab === 'guests' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('guest_property_submissions')}
              </h2>
            </div>
            <div className="p-6">
              {guestSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'en' ? 'No guest submissions yet' : 'እስካሁን የእንግዳ ማቅረቢያዎች የሉም'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' 
                      ? 'Guest property submissions will appear here for review'
                      : 'የእንግዳ ንብረት ማቅረቢያዎች ለግምገማ እዚህ ይታያሉ'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {guestSubmissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{submission.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">
                                <strong>Guest:</strong> {submission.guest_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Phone:</strong> {submission.guest_phone}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>WhatsApp:</strong> {submission.guest_whatsapp}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                <strong>Location:</strong> {submission.area}, {submission.city}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Price:</strong> {new Intl.NumberFormat().format(submission.price)} ETB
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Status:</strong> {submission.property_status}
                              </p>
                            </div>
                          </div>
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Description:</p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                              {submission.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-col space-y-2">
                          {submission.property_status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateGuestSubmissionStatus(submission.id, submission.property_id, 'approve')}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                {t('approve')}
                              </button>
                              <button
                                onClick={() => {
                                  const reasonPrompt = language === 'en' ? 'Rejection reason:' : 'የውድቅነት ምክንያት:'
                                  const reason = prompt(reasonPrompt)
                                  if (reason) {
                                    updateGuestSubmissionStatus(submission.id, submission.property_id, 'reject', reason)
                                  }
                                }}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                              >
                                <XCircleIcon className="w-4 h-4 mr-2" />
                                {t('reject')}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              const message = language === 'en'
                                ? `Hello! Regarding your property: "${submission.title}". We are reviewing your listing.`
                                : `ሰላም! ስለ ንብረትዎ: "${submission.title}". ዝርዝርዎን እየገመገምን ነው።`
                              window.open(`https://wa.me/${submission.guest_whatsapp.replace(/[\+\s-]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
                            }}
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            {language === 'en' ? 'Contact Guest' : 'እንግዳውን ያነጋግሩ'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Broker Applications Tab */}
        {activeTab === 'brokers' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {t('broker_registration_applications')}
              </h2>
              {brokerApplications.length > 0 && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const rejectedCount = brokerApplications.filter(app => app.status === 'rejected').length
                      if (rejectedCount === 0) {
                        alert(language === 'en' ? 'No rejected applications to delete.' : 'ምንም የተወገዱ ማመልከቻዎች የሉም።')
                        return
                      }
                      
                      const confirmMessage = language === 'en' 
                        ? `Delete all ${rejectedCount} rejected broker applications?\n\nThis will permanently remove all rejected applications and their data.\n\nClick OK to delete or Cancel to abort.`
                        : `ሁሉንም ${rejectedCount} የተወገዱ የደላላ ማመልከቻዎች ይሰረዙ?\n\nይህ ሁሉንም የተወገዱ ማመልከቻዎች እና መረጃዎቻቸውን በቋሚነት ያስወግዳል።\n\nለመሰረዝ OK ወይም ለመሰረዝ Cancel ይጫኑ።`
                      
                      if (confirm(confirmMessage)) {
                        bulkDeleteBrokers('rejected')
                      } else {
                        alert(language === 'en' ? '❌ Bulk deletion cancelled.' : '❌ የጅምላ መሰረዝ ተሰርዟል።')
                      }
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    🗑️ {language === 'en' ? 'Delete Rejected' : 'የተወገዱትን ሰርዝ'}
                  </button>
                  
                  <button
                    onClick={() => {
                      const totalCount = brokerApplications.length
                      const confirmMessage = language === 'en' 
                        ? `⚠️ DANGER: Delete ALL ${totalCount} broker applications?\n\nThis will:\n- Remove all applications (pending, approved, rejected)\n- Delete all broker accounts\n- Remove all broker properties\n\nThis action CANNOT be undone!\n\nType "DELETE ALL BROKERS" to confirm:`
                        : `⚠️ አደጋ: ሁሉንም ${totalCount} የደላላ ማመልከቻዎች ይሰረዙ?\n\nይህ:\n- ሁሉንም ማመልከቻዎች ያስወግዳል (በመጠባበቅ ላይ፣ የተፈቀዱ፣ የተወገዱ)\n- ሁሉንም የደላላ መለያዎች ይሰርዛል\n- ሁሉንም የደላላ ንብረቶች ያስወግዳል\n\nይህ ድርጊት መልሶ ሊቀየር አይችልም!\n\n"DELETE ALL BROKERS" ብለው ያረጋግጡ:`
                      
                      const userInput = prompt(confirmMessage)
                      if (userInput === 'DELETE ALL BROKERS') {
                        bulkDeleteBrokers('all')
                      } else if (userInput !== null) {
                        alert(language === 'en' ? '❌ Invalid confirmation. Deletion cancelled.' : '❌ ልክ ያልሆነ ማረጋገጫ። መሰረዝ ተሰርዟል።')
                      } else {
                        alert(language === 'en' ? '❌ Deletion cancelled.' : '❌ መሰረዝ ተሰርዟል።')
                      }
                    }}
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors text-sm"
                  >
                    ⚠️ {language === 'en' ? 'Delete All' : 'ሁሉንም ሰርዝ'}
                  </button>
                </div>
              )}
            </div>
            <div className="p-6">
              {brokerApplications.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'en' ? 'No broker applications yet' : 'እስካሁን የደላላ ማመልከቻዎች የሉም'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' 
                      ? 'Broker registration requests will appear here for review'
                      : 'የደላላ ምዝገባ ጥያቄዎች ለግምገማ እዚህ ይታያሉ'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {brokerApplications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {application.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-gray-900">{application.full_name}</h3>
                              <p className="text-sm text-gray-600">Username: {application.username}</p>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                application.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                                application.status === 'approved' ? 'text-green-600 bg-green-100' :
                                'text-red-600 bg-red-100'
                              }`}>
                                {application.status === 'pending' ? '⏳ Pending Review' :
                                 application.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Contact Information</p>
                                <p className="text-sm text-gray-600">📧 {application.email}</p>
                                <p className="text-sm text-gray-600">📱 {application.phone}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-700">Registration Date</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(application.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Professional Details</p>
                                <p className="text-sm text-gray-600">
                                  <strong>Experience:</strong> {application.experience}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Specialization:</strong> {application.specialization.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </p>
                                {application.license_number && (
                                  <p className="text-sm text-gray-600">
                                    <strong>License:</strong> {application.license_number}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-col space-y-3">
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateBrokerApplicationStatus(application.user_id, 'approved')}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                ✅ {language === 'en' ? 'Approve Broker' : 'ደላላውን ጽድቅ'}
                              </button>
                              <button
                                onClick={() => {
                                  const reasonPrompt = language === 'en' 
                                    ? 'Please provide a reason for rejection:'
                                    : 'እባክዎ የውድቅነት ምክንያት ያቅርቡ:'
                                  const reason = prompt(reasonPrompt)
                                  if (reason) {
                                    updateBrokerApplicationStatus(application.user_id, 'rejected', reason)
                                  }
                                }}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <XCircleIcon className="w-4 h-4 mr-2" />
                                ❌ {language === 'en' ? 'Reject Application' : 'ማመልከቻውን ውድቅ አድርግ'}
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => {
                              const message = encodeURIComponent(`Hello ${application.full_name}! Regarding your broker application on Tag Bridge Home platform.`)
                              window.open(`https://wa.me/${application.phone.replace(/[\+\s-]/g, '')}?text=${message}`, '_blank')
                            }}
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            💬 Contact Applicant
                          </button>
                          
                          <button
                            onClick={() => {
                              window.open(`mailto:${application.email}?subject=Tag Bridge Home - Broker Application&body=Hello ${application.full_name},%0D%0A%0D%0ARegarding your broker application...`, '_blank')
                            }}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            📧 Send Email
                          </button>
                          
                          <button
                            onClick={() => deleteBrokerAccount(application.user_id, application.full_name)}
                            className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            🗑️ {language === 'en' ? 'Delete Account' : 'መለያ ሰርዝ'}
                          </button>
                          
                          {application.status !== 'pending' && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600">
                                Status: <strong>{application.status}</strong>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advertiser Applications Tab */}
        {activeTab === 'advertisers' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'en' ? 'Advertiser Registration Applications' : 'የአስተዋዋቂ ምዝገባ ማመልከቻዎች'}
              </h2>
              {advertiserApplications.length > 0 && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const rejectedCount = advertiserApplications.filter(app => app.status === 'rejected').length
                      if (rejectedCount === 0) {
                        alert(language === 'en' ? 'No rejected applications to delete.' : 'ምንም የተወገዱ ማመልከቻዎች የሉም።')
                        return
                      }
                      
                      const confirmMessage = language === 'en' 
                        ? `Delete all ${rejectedCount} rejected advertiser applications?\n\nThis will permanently remove all rejected applications and their data.`
                        : `ሁሉንም ${rejectedCount} የተወገዱ የአስተዋዋቂ ማመልከቻዎች ይሰረዙ?\n\nይህ ሁሉንም የተወገዱ ማመልከቻዎች እና መረጃዎቻቸውን በቋሚነት ያስወግዳል።`
                      
                      if (confirm(confirmMessage)) {
                        bulkDeleteAdvertisers('rejected')
                      }
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    🗑️ {language === 'en' ? 'Delete Rejected' : 'የተወገዱትን ሰርዝ'}
                  </button>
                  
                  <button
                    onClick={() => {
                      const totalCount = advertiserApplications.length
                      const confirmMessage = language === 'en' 
                        ? `⚠️ DANGER: Delete ALL ${totalCount} advertiser applications?\n\nThis will:\n- Remove all applications (pending, approved, rejected)\n- Delete all advertiser accounts\n- Remove all advertiser properties\n\nThis action CANNOT be undone!\n\nType "DELETE ALL ADVERTISERS" to confirm:`
                        : `⚠️ አደጋ: ሁሉንም ${totalCount} የአስተዋዋቂ ማመልከቻዎች ይሰረዙ?\n\nይህ:\n- ሁሉንም ማመልከቻዎች ያስወግዳል (በመጠባበቅ ላይ፣ የተፈቀዱ፣ የተወገዱ)\n- ሁሉንም የአስተዋዋቂ መለያዎች ይሰርዛል\n- ሁሉንም የአስተዋዋቂ ንብረቶች ያስወግዳል\n\nይህ ድርጊት መልሶ ሊቀየር አይችልም!\n\n"DELETE ALL ADVERTISERS" ብለው ያረጋግጡ:`
                      
                      const userInput = prompt(confirmMessage)
                      if (userInput === 'DELETE ALL ADVERTISERS') {
                        bulkDeleteAdvertisers('all')
                      }
                    }}
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors text-sm"
                  >
                    ⚠️ {language === 'en' ? 'Delete All' : 'ሁሉንም ሰርዝ'}
                  </button>
                </div>
              )}
            </div>
            <div className="p-6">
              {advertiserApplications.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'en' ? 'No advertiser applications yet' : 'እስካሁን የአስተዋዋቂ ማመልከቻዎች የሉም'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' 
                      ? 'Advertiser registration requests will appear here for review'
                      : 'የአስተዋዋቂ ምዝገባ ጥያቄዎች ለግምገማ እዚህ ይታያሉ'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {advertiserApplications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {application.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-gray-900">{application.full_name}</h3>
                              <p className="text-sm text-gray-600">Business: {application.business_name}</p>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                application.status === 'pending' ? 'text-yellow-600 bg-yellow-100' :
                                application.status === 'approved' ? 'text-green-600 bg-green-100' :
                                'text-red-600 bg-red-100'
                              }`}>
                                {application.status === 'pending' ? '⏳ Pending Review' :
                                 application.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Contact Information</p>
                                <p className="text-sm text-gray-600">📧 {application.email}</p>
                                <p className="text-sm text-gray-600">📱 {application.phone_number}</p>
                                {application.whatsapp_number && (
                                  <p className="text-sm text-gray-600">💬 {application.whatsapp_number}</p>
                                )}
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-700">Location</p>
                                <p className="text-sm text-gray-600">📍 {application.area}, {application.city}</p>
                                {application.address && (
                                  <p className="text-sm text-gray-600">{application.address}</p>
                                )}
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-700">Registration Date</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(application.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Business Details</p>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {application.business_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </p>
                                {application.business_license && (
                                  <p className="text-sm text-gray-600">
                                    <strong>License:</strong> {application.business_license}
                                  </p>
                                )}
                                {application.years_in_business && (
                                  <p className="text-sm text-gray-600">
                                    <strong>Experience:</strong> {application.years_in_business} years
                                  </p>
                                )}
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-700">Services</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {JSON.parse(application.services || '[]').map((service: string, index: number) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                      {service.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {application.specialization && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Specialization</p>
                                  <p className="text-sm text-gray-600">{application.specialization}</p>
                                </div>
                              )}
                              
                              {application.website && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Website</p>
                                  <a href={application.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">
                                    {application.website}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {application.description && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-2">Business Description</p>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{application.description}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-6 flex flex-col space-y-3">
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateAdvertiserApplicationStatus(application.id, 'approved')}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                ✅ {language === 'en' ? 'Approve Advertiser' : 'አስተዋዋቂውን ጽድቅ'}
                              </button>
                              <button
                                onClick={() => {
                                  const reasonPrompt = language === 'en' 
                                    ? 'Please provide a reason for rejection:'
                                    : 'እባክዎ የውድቅነት ምክንያት ያቅርቡ:'
                                  const reason = prompt(reasonPrompt)
                                  if (reason) {
                                    updateAdvertiserApplicationStatus(application.id, 'rejected', reason)
                                  }
                                }}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <XCircleIcon className="w-4 h-4 mr-2" />
                                ❌ {language === 'en' ? 'Reject Application' : 'ማመልከቻውን ውድቅ አድርግ'}
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => {
                              const message = encodeURIComponent(`Hello ${application.full_name}! Regarding your advertiser application on Tag Bridge Home platform.`)
                              const phone = application.whatsapp_number || application.phone_number
                              window.open(`https://wa.me/${phone.replace(/[\+\s-]/g, '')}?text=${message}`, '_blank')
                            }}
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            💬 Contact Applicant
                          </button>
                          
                          <button
                            onClick={() => {
                              window.open(`mailto:${application.email}?subject=Tag Bridge Home - Advertiser Application&body=Hello ${application.full_name},%0D%0A%0D%0ARegarding your advertiser application...`, '_blank')
                            }}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            📧 Send Email
                          </button>
                          
                          <button
                            onClick={() => deleteAdvertiserAccount(application.id, application.full_name)}
                            className="flex items-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            🗑️ {language === 'en' ? 'Delete Account' : 'መለያ ሰርዝ'}
                          </button>
                          
                          {application.status !== 'pending' && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600">
                                Status: <strong>{application.status}</strong>
                              </p>
                              {application.reviewed_at && (
                                <p className="text-xs text-gray-600">
                                  Reviewed: {new Date(application.reviewed_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {language === 'en' ? 'All System Users' : 'ሁሉም የስርዓት ተጠቃሚዎች'}
              </h2>
            </div>
            <div className="p-6">
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_users_found')}</h3>
                  <p className="text-gray-600">
                    {language === 'en' ? 'System users will appear here' : 'የስርዓት ተጠቃሚዎች እዚህ ይታያሉ'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'User' : 'ተጠቃሚ'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {t('role')}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'Joined' : 'የተቀላቀለበት'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'Last Login' : 'የመጨረሻ መግቢያ'}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {language === 'en' ? 'Status' : 'ሁኔታ'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                                user.role === 'admin' ? 'bg-red-500' :
                                user.role === 'broker' ? 'bg-blue-500' : 'bg-green-500'
                              }`}>
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'broker' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role === 'admin' ? `🛡️ ${t('admin')}` :
                               user.role === 'broker' ? `👨‍💼 ${t('broker')}` : `👤 ${t('user')}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              🟢 {language === 'en' ? 'Active' : 'ንቁ'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                💳 {language === 'en' ? 'Payment Confirmations' : 'የክፍያ ማረጋገጫዎች'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'en' 
                  ? 'Review and approve broker listing payments'
                  : 'የደላላ ዝርዝር ክፍያዎችን ይገምግሙ እና ያጽድቁ'
                }
              </p>
            </div>
            <div className="p-6">
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💳</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'en' ? 'No pending payments' : 'ምንም በመጠባበቅ ላይ ያሉ ክፍያዎች የሉም'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en' 
                      ? 'Payment confirmations will appear here when brokers submit listings'
                      : 'ደላላዎች ዝርዝሮችን ሲያቀርቡ የክፍያ ማረጋገጫዎች እዚህ ይታያሉ'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {payments.map((payment) => (
                    <div key={payment.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              💰
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-gray-900">{payment.property_title}</h3>
                              <p className="text-sm text-gray-600">
                                {language === 'en' ? 'Broker:' : 'ደላላ:'} {payment.broker_name}
                              </p>
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                payment.status === 'awaiting_payment' ? 'text-yellow-600 bg-yellow-100' :
                                payment.status === 'approved' ? 'text-green-600 bg-green-100' :
                                'text-red-600 bg-red-100'
                              }`}>
                                {payment.status === 'awaiting_payment' ? '⏳ Awaiting Payment Receipt' :
                                 payment.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Property Details</p>
                                <p className="text-sm text-gray-600">📍 {payment.area}, {payment.city}</p>
                                <p className="text-sm text-gray-600">
                                  🏠 {payment.property_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {payment.is_premium ? '⭐ Premium Listing' : '📋 Basic Listing'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-gray-700">Payment Information</p>
                                <p className="text-sm text-gray-600">
                                  <strong>Amount:</strong> {payment.amount} ETB
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Method:</strong> {payment.payment_method === 'cbe' ? '🏦 CBE Bank' : '📱 TeleBirr'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Type:</strong> {payment.payment_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-gray-700">Submission Date</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(payment.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 flex flex-col space-y-3">
                          {payment.status === 'awaiting_payment' && (
                            <>
                              <button
                                onClick={() => updatePaymentStatus(payment.id, payment.property_id, 'approve')}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                ✅ {language === 'en' ? 'Approve Payment' : 'ክፍያውን ጽድቅ'}
                              </button>
                              <button
                                onClick={() => {
                                  const confirmMessage = language === 'en' 
                                    ? 'Are you sure you want to reject this payment? The property listing will be rejected.'
                                    : 'ይህንን ክፍያ ውድቅ ማድረግ እርግጠኛ ነዎት? የንብረት ዝርዝሩ ውድቅ ይሆናል።'
                                  if (confirm(confirmMessage)) {
                                    updatePaymentStatus(payment.id, payment.property_id, 'reject')
                                  }
                                }}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <XCircleIcon className="w-4 h-4 mr-2" />
                                ❌ {language === 'en' ? 'Reject Payment' : 'ክፍያውን ውድቅ አድርግ'}
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => {
                              const message = encodeURIComponent(`Hello ${payment.broker_name}! Regarding your property listing payment for "${payment.property_title}". Amount: ${payment.amount} ETB.`)
                              window.open(`https://wa.me/0991856292?text=${message}`, '_blank')
                            }}
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            💬 {language === 'en' ? 'Contact Broker' : 'ደላላውን ያነጋግሩ'}
                          </button>
                          
                          {payment.status !== 'awaiting_payment' && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600">
                                Status: <strong>{payment.status}</strong>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manage Users Tab */}
        {activeTab === 'manage-users' && (
          <div className="space-y-6">
            {/* Create New User Form */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  ➕ {t('create_new_user')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'en' 
                    ? 'Add new admin, broker, or regular user accounts'
                    : 'አዲስ አስተዳዳሪ፣ ደላላ ወይም መደበኛ የተጠቃሚ መለያዎችን ይጨምሩ'
                  }
                </p>
              </div>
              <div className="p-6">
                <form onSubmit={createUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('username')}
                      </label>
                      <input
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('enter_username')}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('password')}
                      </label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={t('enter_password')}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('role')}
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="user">👤 {t('regular_user')}</option>
                        <option value="broker">👨‍💼 {t('broker')}</option>
                        {!adminSetupComplete && (
                          <option value="admin">🛡️ {t('admin')}</option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={userManagementLoading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {userManagementLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t('creating')}
                        </>
                      ) : (
                        <>
                          ➕ {t('create_user')}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Admin Users Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  🛡️ {t('admin_users')} ({users.filter(u => u.role === 'admin').length})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'en' 
                    ? 'System administrators with full access'
                    : 'ሙሉ መዳረሻ ያላቸው የስርዓት አስተዳዳሪዎች'
                  }
                </p>
              </div>
              <div className="p-6">
                {users.filter(u => u.role === 'admin').length === 0 ? (
                  <div className="text-center py-8">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_admin_users')}</h3>
                    <p className="text-gray-600">
                      {language === 'en' 
                        ? 'Create admin accounts using the form above'
                        : 'ከላይ ያለውን ቅጽ በመጠቀም የአስተዳዳሪ መለያዎችን ይፍጠሩ'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.filter(u => u.role === 'admin').map((user) => (
                      <div key={user.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-lg">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                              <p className="text-sm text-gray-600">
                                Created: {new Date(user.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                🛡️ {t('system_administrator')}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {user.username === 'tedayeerasu' ? (
                              <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
                                🔒 {t('protected_account')}
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditUser(user)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                >
                                  ✏️ {t('edit')}
                                </button>
                                <button
                                  onClick={() => deleteUser(user.username)}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                >
                                  🗑️ {t('delete')}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Broker Users Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  👨‍💼 {t('broker_users')} ({users.filter(u => u.role === 'broker').length})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'en' 
                    ? 'Property brokers with listing management access'
                    : 'የዝርዝር አስተዳደር መዳረሻ ያላቸው የንብረት ደላላዎች'
                  }
                </p>
              </div>
              <div className="p-6">
                {users.filter(u => u.role === 'broker').length === 0 ? (
                  <div className="text-center py-8">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_broker_users')}</h3>
                    <p className="text-gray-600">
                      {language === 'en' 
                        ? 'Brokers will appear here after registration approval'
                        : 'ደላላዎች ከምዝገባ ማጽደቅ በኋላ እዚህ ይታያሉ'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.filter(u => u.role === 'broker').map((user) => (
                      <div key={user.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                              <p className="text-sm text-gray-600">
                                Created: {new Date(user.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                👨‍💼 {t('property_broker')}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditUser(user)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => deleteUser(user.username)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Regular Users Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  👤 {t('regular_users')} ({users.filter(u => u.role === 'user').length})
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'en' 
                    ? 'Standard users with basic access'
                    : 'መሰረታዊ መዳረሻ ያላቸው መደበኛ ተጠቃሚዎች'
                  }
                </p>
              </div>
              <div className="p-6">
                {users.filter(u => u.role === 'user').length === 0 ? (
                  <div className="text-center py-8">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('no_regular_users')}</h3>
                    <p className="text-gray-600">{t('users_will_appear_here')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {users.filter(u => u.role === 'user').map((user) => (
                      <div key={user.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3">
                              <h4 className="font-medium text-gray-900">{user.username}</h4>
                              <p className="text-xs text-gray-600">
                                {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => startEditUser(user)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteUser(user.username)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    {t('security_notice')}
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        {language === 'en' 
                          ? 'Only create admin accounts for trusted personnel'
                          : 'የአስተዳዳሪ መለያዎችን ለታመኑ ሰራተኞች ብቻ ይፍጠሩ'
                        }
                      </li>
                      <li>{t('cannot_delete_main_admin')}</li>
                      <li>{t('admin_full_access')}</li>
                      <li>{t('use_strong_passwords')}</li>
                      <li>
                        {language === 'en' 
                          ? 'Regularly review user accounts and remove unused ones'
                          : 'የተጠቃሚ መለያዎችን በመደበኛነት ይገምግሙ እና ያልተጠቀሙባቸውን ያስወግዱ'
                        }
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ✏️ {language === 'en' ? `Edit User: ${editingUser.username}` : `ተጠቃሚ አርም: ${editingUser.username}`}
              </h3>
              <form onSubmit={updateUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('username')}
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={editingUser.username === 'tedayeerasu'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('role')}
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={editingUser.username === 'tedayeerasu'}
                  >
                    <option value="user">👤 {t('regular_user')}</option>
                    <option value="broker">👨‍💼 {t('broker')}</option>
                    <option value="admin">🛡️ {t('admin')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('new_password')} ({t('leave_empty_keep_current')})
                  </label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={language === 'en' 
                      ? 'Enter new password or leave empty'
                      : 'አዲስ የይለፍ ቃል ያስገቡ ወይም ባዶ ይተዉ'
                    }
                    disabled={editingUser.username === 'tedayeerasu'}
                  />
                </div>
                {editingUser.username === 'tedayeerasu' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-700">
                      🔒 {language === 'en' 
                        ? 'The main admin account cannot be modified for security reasons.'
                        : 'ዋናው የአስተዳዳሪ መለያ ለደህንነት ምክንያቶች ሊሻሻል አይችልም።'
                      }
                    </p>
                  </div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={userManagementLoading || editingUser.username === 'tedayeerasu'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {userManagementLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('updating')}
                      </>
                    ) : (
                      `${t('update')} ${t('user')}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Create New Banner Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📢 {language === 'en' ? 'Create New Banner' : 'አዲስ ባነር ይፍጠሩ'}
              </h3>
              <form onSubmit={createBanner} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Banner ID' : 'የባነር መለያ'} *
                    </label>
                    <input
                      type="text"
                      value={newBanner.id}
                      onChange={(e) => setNewBanner({...newBanner, id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="unique-banner-id"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Type' : 'ዓይነት'}
                    </label>
                    <select
                      value={newBanner.type}
                      onChange={(e) => setNewBanner({...newBanner, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="promotion">🎯 Promotion</option>
                      <option value="announcement">📢 Announcement</option>
                      <option value="feature">⭐ Feature</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Title (English)' : 'ርዕስ (እንግሊዝኛ)'} *
                    </label>
                    <input
                      type="text"
                      value={newBanner.title_en}
                      onChange={(e) => setNewBanner({...newBanner, title_en: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="🎉 Your English Title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Title (Amharic)' : 'ርዕስ (አማርኛ)'} *
                    </label>
                    <input
                      type="text"
                      value={newBanner.title_am}
                      onChange={(e) => setNewBanner({...newBanner, title_am: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="🎉 የአማርኛ ርዕስዎ"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Description (English)' : 'መግለጫ (እንግሊዝኛ)'} *
                    </label>
                    <textarea
                      value={newBanner.description_en}
                      onChange={(e) => setNewBanner({...newBanner, description_en: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Your English description here..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Description (Amharic)' : 'መግለጫ (አማርኛ)'} *
                    </label>
                    <textarea
                      value={newBanner.description_am}
                      onChange={(e) => setNewBanner({...newBanner, description_am: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="የአማርኛ መግለጫዎ እዚህ..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Button Text (English)' : 'የቁልፍ ጽሑፍ (እንግሊዝኛ)'} *
                    </label>
                    <input
                      type="text"
                      value={newBanner.button_text_en}
                      onChange={(e) => setNewBanner({...newBanner, button_text_en: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Click Here"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Button Text (Amharic)' : 'የቁልፍ ጽሑፍ (አማርኛ)'} *
                    </label>
                    <input
                      type="text"
                      value={newBanner.button_text_am}
                      onChange={(e) => setNewBanner({...newBanner, button_text_am: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="እዚህ ይጫኑ"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Button Link' : 'የቁልፍ አገናኝ'} *
                    </label>
                    <input
                      type="text"
                      value={newBanner.button_link}
                      onChange={(e) => setNewBanner({...newBanner, button_link: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="/your-page"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Icon (Emoji)' : 'አዶ (ኢሞጂ)'}
                    </label>
                    <input
                      type="text"
                      value={newBanner.icon}
                      onChange={(e) => setNewBanner({...newBanner, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="🎉"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Background Color' : 'የጀርባ ቀለም'}
                    </label>
                    <select
                      value={newBanner.background_color}
                      onChange={(e) => setNewBanner({...newBanner, background_color: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="from-blue-500 to-purple-600">🔵 Blue to Purple</option>
                      <option value="from-green-500 to-teal-600">🟢 Green to Teal</option>
                      <option value="from-red-500 to-orange-600">🔴 Red to Orange</option>
                      <option value="from-purple-500 to-pink-600">🟣 Purple to Pink</option>
                      <option value="from-indigo-500 to-blue-600">🔷 Indigo to Blue</option>
                      <option value="from-yellow-500 to-orange-600">🟡 Yellow to Orange</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newBanner.is_active === 1}
                      onChange={(e) => setNewBanner({...newBanner, is_active: e.target.checked ? 1 : 0})}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {language === 'en' ? 'Active (Show on homepage)' : 'ንቁ (በመነሻ ገጽ ላይ አሳይ)'}
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={bannerLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {bannerLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === 'en' ? 'Creating...' : 'በመፍጠር ላይ...'}
                    </>
                  ) : (
                    <>
                      <span className="mr-2">➕</span>
                      {language === 'en' ? 'Create Banner' : 'ባነር ይፍጠሩ'}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Existing Banners List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  📋 {language === 'en' ? 'Existing Banners' : 'ያሉ ባነሮች'} ({banners.length})
                </h3>
              </div>
              <div className="p-6">
                {bannerLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">{language === 'en' ? 'Loading banners...' : 'ባነሮችን በመጫን ላይ...'}</p>
                  </div>
                ) : banners.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📢</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {language === 'en' ? 'No Banners Found' : 'ምንም ባነሮች አልተገኙም'}
                    </h4>
                    <p className="text-gray-600">
                      {language === 'en' ? 'Create your first banner using the form above.' : 'ከላይ ያለውን ቅጽ በመጠቀም የመጀመሪያ ባነርዎን ይፍጠሩ።'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {banners.map((banner) => (
                      <div key={banner.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{banner.icon}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{banner.title_en}</h4>
                              <p className="text-sm text-gray-600">{banner.title_am}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              banner.type === 'promotion' ? 'bg-blue-100 text-blue-800' :
                              banner.type === 'announcement' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {banner.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                banner.is_active 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {banner.is_active ? '✅ Active' : '❌ Inactive'}
                            </button>
                            <button
                              onClick={() => setEditingBanner(banner)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => deleteBanner(banner.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1"><strong>EN:</strong> {banner.description_en}</p>
                            <p className="text-gray-600"><strong>AM:</strong> {banner.description_am}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1"><strong>Link:</strong> {banner.button_link}</p>
                            <p className="text-gray-600"><strong>Button:</strong> {banner.button_text_en} / {banner.button_text_am}</p>
                          </div>
                        </div>
                        {/* Preview */}
                        <div className="mt-3">
                          <div className={`bg-gradient-to-r ${banner.background_color} text-white p-4 rounded-lg`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{banner.icon}</span>
                                <div>
                                  <h5 className="font-bold">{banner.title_en}</h5>
                                  <p className="text-sm opacity-90">{banner.description_en}</p>
                                </div>
                              </div>
                              <button className="bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold">
                                {banner.button_text_en}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Banner Modal */}
            {editingBanner && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ✏️ {language === 'en' ? `Edit Banner: ${editingBanner.id}` : `ባነር አርም: ${editingBanner.id}`}
                  </h3>
                  <form onSubmit={(e) => { e.preventDefault(); updateBanner(editingBanner); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Title (English)' : 'ርዕስ (እንግሊዝኛ)'} *
                        </label>
                        <input
                          type="text"
                          value={editingBanner.title_en}
                          onChange={(e) => setEditingBanner({...editingBanner, title_en: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Title (Amharic)' : 'ርዕስ (አማርኛ)'} *
                        </label>
                        <input
                          type="text"
                          value={editingBanner.title_am}
                          onChange={(e) => setEditingBanner({...editingBanner, title_am: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Description (English)' : 'መግለጫ (እንግሊዝኛ)'} *
                        </label>
                        <textarea
                          value={editingBanner.description_en}
                          onChange={(e) => setEditingBanner({...editingBanner, description_en: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {language === 'en' ? 'Description (Amharic)' : 'መግለጫ (አማርኛ)'} *
                        </label>
                        <textarea
                          value={editingBanner.description_am}
                          onChange={(e) => setEditingBanner({...editingBanner, description_am: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingBanner(null)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        {language === 'en' ? 'Cancel' : 'ሰርዝ'}
                      </button>
                      <button
                        type="submit"
                        disabled={bannerLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {bannerLoading ? (language === 'en' ? 'Updating...' : 'በማዘመን ላይ...') : (language === 'en' ? 'Update Banner' : 'ባነር አዘምን')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}