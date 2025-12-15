'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { ETHIOPIAN_CITIES } from '../types'
import { 
  HomeIcon, 
  PhotoIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import PhotoUpload from '../components/PhotoUpload'

export default function GuestPropertySubmissionPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Guest Information
    guestName: '',
    guestPhone: '',
    guestWhatsapp: '',
    
    // Property Information
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
    images: [] as string[]
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submissionId, setSubmissionId] = useState('')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/guest-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setSubmissionId(result.submissionId)
        setShowSuccessModal(true)
      } else {
        alert(result.error || 'Failed to submit property')
      }
    } catch (error) {
      console.error('Error submitting property:', error)
      alert('Failed to submit property')
    } finally {
      setIsLoading(false)
    }
  }

  const commonFeatures = [
    'Parking', 'Garden', 'Balcony', 'Modern Kitchen', 'Furnished', 
    'Security', 'Elevator', 'Generator', 'Water Tank', 'Internet Ready'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200 to-green-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      <main className="relative max-w-4xl mx-auto px-4 py-8 pb-24">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 md:p-10">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <HomeIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs">✨</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Submit Your Property
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              List your property for free - No registration required!
            </p>
            <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-200/50 shadow-inner">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-2xl">📋</span>
                <span className="font-semibold text-blue-800">Free Professional Review</span>
              </div>
              <p className="text-sm text-blue-700">
                Your submission will be reviewed by our expert admin team and published at no cost
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Guest Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 shadow-sm form-section">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Your Contact Information
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Full Name *
                  </label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Phone Number *
                    </label>
                    <div className="relative group">
                      <PhoneIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      <input
                        type="tel"
                        name="guestPhone"
                        value={formData.guestPhone}
                        onChange={handleInputChange}
                        placeholder="+251911234567"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      WhatsApp Number *
                    </label>
                    <div className="relative group">
                      <ChatBubbleLeftRightIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      <input
                        type="tel"
                        name="guestWhatsapp"
                        value={formData.guestWhatsapp}
                        onChange={handleInputChange}
                        placeholder="+251911234567"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50 shadow-sm form-section">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <HomeIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Property Information
                </h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Modern 3 Bedroom House in Bole"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Property Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900"
                    required
                  >
                    <option value="house_sale">🏠 House for Sale</option>
                    <option value="house_rent">🏠 House for Rent</option>
                    <option value="apartment_sale">🏢 Apartment for Sale</option>
                    <option value="apartment_rent">🏢 Apartment for Rent</option>
                    <option value="commercial_sale">🏪 Commercial for Sale</option>
                    <option value="commercial_rent">🏪 Commercial for Rent</option>
                    <option value="land_sale">🌍 Land for Sale</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Price *
                    </label>
                    <div className="relative group">
                      <CurrencyDollarIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900"
                    >
                      <option value="ETB">💰 ETB (Ethiopian Birr)</option>
                      <option value="USD">💵 USD (US Dollar)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 shadow-sm form-section">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <MapPinIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Location
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900"
                    required
                  >
                    <option value="">🏙️ Select City</option>
                    {ETHIOPIAN_CITIES.map(city => (
                      <option key={city} value={city}>
                        📍 {city}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Area/Neighborhood *
                  </label>
                  <div className="relative group">
                    <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="e.g., Bole, Kazanchis"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200/50 shadow-sm form-section">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📐</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Property Details
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    🛏️ Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    🚿 Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    📏 Size (m²) *
                  </label>
                  <input
                    type="number"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200/50 shadow-sm form-section">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">✨</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Property Features
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {commonFeatures.map(feature => (
                  <label key={feature} className="group flex items-center space-x-3 cursor-pointer p-3 rounded-xl border-2 border-transparent hover:border-indigo-200 hover:bg-white/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="w-5 h-5 rounded-lg border-2 border-gray-300 text-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700 transition-colors">
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200/50 shadow-sm form-section">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <PhotoIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Property Photos
                </h3>
              </div>
              <PhotoUpload
                images={formData.images}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                maxImages={10}
                className="bg-white/50 rounded-xl p-4"
              />
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200/50 shadow-sm form-section">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Property Description
                </h3>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Tell us about your property *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe your property in detail - location benefits, amenities, nearby facilities, unique features, and what makes it special..."
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all duration-200 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 resize-none"
                  required
                />
              </div>
            </div>

            {/* Submission Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <PhotoIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-amber-800 mb-2 flex items-center">
                    <span className="mr-2">🎉</span>
                    100% Free Submission
                  </h4>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Your property will be professionally reviewed by our expert admin team and published at absolutely no cost. We may reach out for additional photos or details to make your listing shine!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 px-8 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ${
                  isLoading ? 'opacity-50 cursor-not-allowed transform-none' : ''
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Submitting Property...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Submit Property for Review</span>
                      <span>✨</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal 
          submissionId={submissionId}
          onClose={() => {
            setShowSuccessModal(false)
            router.push('/')
          }}
        />
      )}
    </div>
  )
}

function SuccessModal({ submissionId, onClose }: { submissionId: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-white/20 transform animate-slideUp">
        <div className="text-center">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-lg">🎉</span>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Property Submitted Successfully!
          </h3>
          <p className="text-gray-600 mb-6">Your listing is now under review</p>
          
          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200/50">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <span className="text-lg">🆔</span>
                <p className="text-sm font-semibold text-gray-700">
                  Submission ID
                </p>
              </div>
              <p className="text-lg font-mono text-gray-900 break-all bg-white/70 px-4 py-2 rounded-xl">
                {submissionId}
              </p>
            </div>
            
            <div className="text-left bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200/50">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl">📋</span>
                <p className="text-sm font-bold text-gray-800">
                  What happens next:
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-gray-700">Our expert admin team will review your property details</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                  <p className="text-sm text-gray-700">We may contact you for additional photos or information</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                  <p className="text-sm text-gray-700">Once approved, your property will be published and promoted</p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>🏠</span>
              <span>Back to Home</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}