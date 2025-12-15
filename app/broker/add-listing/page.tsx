'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { 
  HomeIcon, 
  CurrencyDollarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import PhotoUpload from '../../components/PhotoUpload'

const ETHIOPIAN_CITIES = [
  'Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Mekelle', 
  'Gondar', 'Jimma', 'Dire Dawa', 'Dessie', 'Nekemte'
]

const PROPERTY_TYPES = [
  'house_sale', 'house_rent', 'apartment_sale', 'apartment_rent',
  'villa_sale', 'villa_rent', 'land', 'shop_sale', 'shop_rent'
]

export default function BrokerAddListingPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'ETB',
    city: '',
    area: '',
    type: 'house_sale',
    bedrooms: '',
    bathrooms: '',
    size: '',
    features: [] as string[],
    whatsappNumber: '',
    phoneNumber: '',
    images: [] as string[]
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<any>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [listingType, setListingType] = useState<'basic' | 'premium'>('basic')
  const [paymentMethod, setPaymentMethod] = useState<'cbe' | 'telebirr'>('cbe')

  // Redirect if not authenticated or not a broker/admin
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    // Only allow brokers and admins to access this page
    if (user.role !== 'broker' && user.role !== 'admin') {
      router.push('/')
      return
    }
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  // Calculate payment amount based on property type and listing type
  const calculatePaymentAmount = () => {
    const isRental = formData.type.includes('rent')
    const isSale = formData.type.includes('sale')
    
    let baseAmount = 0
    if (isRental) {
      baseAmount = 25 // 25 birr for rent listings
    } else if (isSale) {
      baseAmount = 50 // 50 birr for sale listings
    }
    
    if (listingType === 'premium') {
      baseAmount += 100 // Additional 100 birr for premium/advertising
    }
    
    return baseAmount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Show payment modal before creating listing
    const amount = calculatePaymentAmount()
    setPaymentInfo({
      amount,
      propertyType: formData.type,
      listingType,
      paymentMethod
    })
    setShowPaymentModal(true)
  }

  const handlePaymentConfirmation = async () => {
    setIsLoading(true)
    setShowPaymentModal(false)

    try {
      const token = localStorage.getItem('token')
      
      // Add payment and listing type info to form data
      const submissionData = {
        ...formData,
        listingType,
        paymentAmount: paymentInfo.amount,
        paymentMethod,
        isPremium: listingType === 'premium',
        paymentStatus: 'pending_payment' // Property goes to pending status
      }
      
      const response = await fetch('/api/properties-working', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      })

      const result = await response.json()

      if (result.success) {
        // Open WhatsApp to show payment account only
        openWhatsAppForPayment()
        
        alert(`Property listing created successfully! 

Your property is now PENDING admin approval.

Payment Required: ${paymentInfo.amount} ETB
Account: ${paymentMethod === 'cbe' ? 'CBE 1000200450705' : 'TeleBirr 0991856292'}

Please send payment receipt via WhatsApp to: 0991856292`)
        
        router.push('/broker')
      } else {
        alert(result.error || 'Failed to create listing')
      }
    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Failed to create listing')
    } finally {
      setIsLoading(false)
    }
  }

  const openWhatsAppForPayment = () => {
    // Simple message just showing the WhatsApp contact for payment
    const message = `Hello! I need to send payment receipt for my property listing.

Property: ${formData.title}
Amount: ${paymentInfo.amount} ETB
Payment Method: ${paymentMethod === 'cbe' ? 'CBE Bank 1000200450705' : 'TeleBirr 0991856292'}

I will send the payment receipt now.`

    const whatsappUrl = `https://wa.me/0991856292?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const commonFeatures = [
    'Parking', 'Garden', 'Balcony', 'Modern Kitchen', 'Furnished', 
    'Security', 'Elevator', 'Generator', 'Water Tank', 'Internet Ready'
  ]

  const formatPropertyType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Don't render if user is not a broker or admin
  if (!user || (user.role !== 'broker' && user.role !== 'admin')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HomeIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Add Property Listing
            </h1>
            <p className="text-gray-600">
              List your property for sale or rent
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Modern 3 Bedroom House in Bole"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>
                      {formatPropertyType(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="ETB">ETB (Ethiopian Birr)</option>
                    <option value="USD">USD (US Dollar)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select City</option>
                    {ETHIOPIAN_CITIES.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area/Neighborhood *
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="e.g., Bole, Kazanchis"
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Property Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size (m²) *
                  </label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Features
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonFeatures.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+251911234567"
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <div className="relative">
                    <ChatBubbleLeftRightIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleInputChange}
                      placeholder="+251911234567"
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <PhotoUpload
                images={formData.images}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                maxImages={10}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your property in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Payment & Listing Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                💰 Listing Type & Payment
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Listing */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    listingType === 'basic' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setListingType('basic')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="listingType"
                      value="basic"
                      checked={listingType === 'basic'}
                      onChange={() => setListingType('basic')}
                      className="text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">📋 Basic Listing</h4>
                      <p className="text-sm text-gray-600">
                        {formData.type.includes('rent') ? '25 ETB' : '50 ETB'} - Standard visibility
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Listing */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    listingType === 'premium' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setListingType('premium')}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="listingType"
                      value="premium"
                      checked={listingType === 'premium'}
                      onChange={() => setListingType('premium')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">⭐ Premium/Advertising</h4>
                      <p className="text-sm text-gray-600">
                        {calculatePaymentAmount()} ETB - Featured at top, premium badge
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Payment Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      paymentMethod === 'cbe' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('cbe')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cbe"
                        checked={paymentMethod === 'cbe'}
                        onChange={() => setPaymentMethod('cbe')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">🏦 CBE Bank</h5>
                        <p className="text-xs text-gray-600">Account: 1000200450705</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      paymentMethod === 'telebirr' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('telebirr')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="telebirr"
                        checked={paymentMethod === 'telebirr'}
                        onChange={() => setPaymentMethod('telebirr')}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">📱 TeleBirr</h5>
                        <p className="text-xs text-gray-600">Number: 0991856292</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">💳 Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Property Type:</span>
                    <span className="font-medium">{formatPropertyType(formData.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Fee:</span>
                    <span>{formData.type.includes('rent') ? '25' : '50'} ETB</span>
                  </div>
                  {listingType === 'premium' && (
                    <div className="flex justify-between">
                      <span>Premium/Advertising:</span>
                      <span>+100 ETB</span>
                    </div>
                  )}
                  <div className="border-t pt-1 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-green-600">{calculatePaymentAmount()} ETB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Broker Status Warning */}
            {user?.brokerStatus === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-400 text-xl">⏳</div>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">
                      Broker Account Pending Approval
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Your broker application is still under review. You can create listings, but they will be held until your account is approved by admin.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating Listing...' : `Create Listing - ${calculatePaymentAmount()} ETB`}
            </button>
          </form>
        </div>

        {/* Payment Confirmation Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CurrencyDollarIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  💳 Payment Required
                </h3>
                <p className="text-gray-600">
                  Complete payment to publish your listing
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Property:</span>
                      <span className="font-medium">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{formatPropertyType(formData.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Listing:</span>
                      <span>{listingType === 'premium' ? '⭐ Premium/Advertising' : '📋 Basic'}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount:</span>
                        <span className="text-green-600">{paymentInfo?.amount} ETB</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {paymentMethod === 'cbe' ? '🏦 CBE Bank Transfer' : '📱 TeleBirr Payment'}
                  </h4>
                  <div className="text-sm text-gray-700">
                    <p className="font-medium text-lg">
                      {paymentMethod === 'cbe' 
                        ? '📱 Account: 1000200450705' 
                        : '📱 TeleBirr: 0991856292'
                      }
                    </p>
                    <div className="mt-3 p-2 bg-yellow-100 rounded border-l-4 border-yellow-500">
                      <p className="text-sm font-medium">📋 Payment Process:</p>
                      <ol className="text-xs mt-1 space-y-1">
                        <li>1. Click "Confirm" → Property goes to PENDING</li>
                        <li>2. Send payment to account above</li>
                        <li>3. Send payment receipt via WhatsApp: <strong>0991856292</strong></li>
                        <li>4. Admin will approve after payment verification</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentConfirmation}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Confirm & Send WhatsApp'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}