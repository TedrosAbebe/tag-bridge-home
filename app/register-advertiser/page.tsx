'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '../contexts/LanguageContext'

export default function RegisterAdvertiserPage() {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    
    // Business Information
    businessName: '',
    businessType: '',
    businessLicense: '',
    yearsInBusiness: '',
    
    // Address Information
    city: '',
    area: '',
    address: '',
    
    // Services
    services: [] as string[],
    specialization: '',
    
    // Additional Information
    website: '',
    socialMedia: '',
    description: '',
    
    // Agreement
    agreeToTerms: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const ethiopianCities = [
    'Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Mekelle', 
    'Gondar', 'Jimma', 'Dire Dawa', 'Dessie', 'Nekemte'
  ]

  const businessTypes = [
    'real_estate_agency',
    'property_developer',
    'construction_company',
    'property_management',
    'individual_investor',
    'commercial_broker',
    'land_developer'
  ]

  const serviceOptions = [
    'property_sales',
    'property_rentals',
    'property_management',
    'construction',
    'renovation',
    'property_valuation',
    'legal_services',
    'financing_assistance'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (name === 'agreeToTerms') {
        setFormData(prev => ({ ...prev, [name]: checked }))
      } else {
        // Handle service checkboxes
        setFormData(prev => ({
          ...prev,
          services: checked 
            ? [...prev.services, value]
            : prev.services.filter(service => service !== value)
        }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/auth/register-advertiser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage(language === 'en' 
          ? 'Application submitted successfully! We will review your application and contact you within 2-3 business days.'
          : 'ማመልከቻዎ በተሳካ ሁኔታ ተልኳል! ማመልከቻዎን እንገመግማለን እና በ2-3 የስራ ቀናት ውስጥ እናገናኝዎታለን።'
        )
        // Reset form
        setFormData({
          fullName: '', email: '', phoneNumber: '', whatsappNumber: '',
          businessName: '', businessType: '', businessLicense: '', yearsInBusiness: '',
          city: '', area: '', address: '', services: [], specialization: '',
          website: '', socialMedia: '', description: '', agreeToTerms: false
        })
      } else {
        setSubmitMessage(data.message || (language === 'en' ? 'Registration failed. Please try again.' : 'ምዝገባ አልተሳካም። እባክዎ እንደገና ይሞክሩ።'))
      }
    } catch (error) {
      setSubmitMessage(language === 'en' ? 'Network error. Please try again.' : 'የኔትወርክ ስህተት። እባክዎ እንደገና ይሞክሩ።')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCityName = (city: string) => {
    const cityTranslations: { [key: string]: { en: string, am: string } } = {
      'Addis Ababa': { en: 'Addis Ababa', am: 'አዲስ አበባ' },
      'Adama': { en: 'Adama', am: 'አዳማ' },
      'Hawassa': { en: 'Hawassa', am: 'ሐዋሳ' },
      'Bahir Dar': { en: 'Bahir Dar', am: 'ባሕር ዳር' },
      'Mekelle': { en: 'Mekelle', am: 'መቐለ' },
      'Gondar': { en: 'Gondar', am: 'ጎንደር' },
      'Jimma': { en: 'Jimma', am: 'ጅማ' },
      'Dire Dawa': { en: 'Dire Dawa', am: 'ድሬ ዳዋ' },
      'Dessie': { en: 'Dessie', am: 'ደሴ' },
      'Nekemte': { en: 'Nekemte', am: 'ነቀምት' }
    }
    return cityTranslations[city]?.[language] || city
  }

  const getBusinessTypeName = (type: string) => {
    const typeTranslations: { [key: string]: { en: string, am: string } } = {
      'real_estate_agency': { en: 'Real Estate Agency', am: 'የሪል እስቴት ኤጀንሲ' },
      'property_developer': { en: 'Property Developer', am: 'የንብረት ገንቢ' },
      'construction_company': { en: 'Construction Company', am: 'የግንባታ ኩባንያ' },
      'property_management': { en: 'Property Management', am: 'የንብረት አስተዳደር' },
      'individual_investor': { en: 'Individual Investor', am: 'ግለሰብ ባለሀብት' },
      'commercial_broker': { en: 'Commercial Broker', am: 'የንግድ ደላላ' },
      'land_developer': { en: 'Land Developer', am: 'የመሬት ገንቢ' }
    }
    return typeTranslations[type]?.[language] || type
  }

  const getServiceName = (service: string) => {
    const serviceTranslations: { [key: string]: { en: string, am: string } } = {
      'property_sales': { en: 'Property Sales', am: 'የንብረት ሽያጭ' },
      'property_rentals': { en: 'Property Rentals', am: 'የንብረት ኪራይ' },
      'property_management': { en: 'Property Management', am: 'የንብረት አስተዳደር' },
      'construction': { en: 'Construction', am: 'ግንባታ' },
      'renovation': { en: 'Renovation', am: 'ማሻሻያ' },
      'property_valuation': { en: 'Property Valuation', am: 'የንብረት ግምት' },
      'legal_services': { en: 'Legal Services', am: 'የህግ አገልግሎት' },
      'financing_assistance': { en: 'Financing Assistance', am: 'የፋይናንስ እርዳታ' }
    }
    return serviceTranslations[service]?.[language] || service
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">🏢</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Register as Advertiser/Real Estate Owner' : 'እንደ አስተዋዋቂ/የሪል እስቴት ባለቤት ይመዝገቡ'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Join our premium network of real estate professionals and property advertisers. Get access to advanced listing features and marketing tools.'
              : 'የእኛን ፕሪሚየም የሪል እስቴት ባለሙያዎች እና የንብረት አስተዋዋቂዎች ኔትወርክ ይቀላቀሉ። የላቀ የዝርዝር ባህሪያት እና የግብይት መሳሪያዎች ያግኙ።'
            }
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Personal Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👤</span>
                {language === 'en' ? 'Personal Information' : 'የግል መረጃ'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Full Name *' : 'ሙሉ ስም *'}
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter your full name' : 'ሙሉ ስምዎን ያስገቡ'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Email Address *' : 'ኢሜይል አድራሻ *'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter your email' : 'ኢሜይልዎን ያስገቡ'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Phone Number *' : 'ስልክ ቁጥር *'}
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+251-911-123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'WhatsApp Number' : 'ዋትስአፕ ቁጥር'}
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+251-911-123456"
                  />
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🏢</span>
                {language === 'en' ? 'Business Information' : 'የንግድ መረጃ'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Business Name *' : 'የንግድ ስም *'}
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter business name' : 'የንግድ ስም ያስገቡ'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Business Type *' : 'የንግድ አይነት *'}
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{language === 'en' ? 'Select business type' : 'የንግድ አይነት ይምረጡ'}</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{getBusinessTypeName(type)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Business License Number' : 'የንግድ ፈቃድ ቁጥር'}
                  </label>
                  <input
                    type="text"
                    name="businessLicense"
                    value={formData.businessLicense}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter license number' : 'የፈቃድ ቁጥር ያስገቡ'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Years in Business' : 'በንግድ ውስጥ ያሉ ዓመታት'}
                  </label>
                  <input
                    type="number"
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📍</span>
                {language === 'en' ? 'Location Information' : 'የአካባቢ መረጃ'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'City *' : 'ከተማ *'}
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">{language === 'en' ? 'Select city' : 'ከተማ ይምረጡ'}</option>
                    {ethiopianCities.map(city => (
                      <option key={city} value={city}>{getCityName(city)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Area/District *' : 'አካባቢ/ወረዳ *'}
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter area/district' : 'አካባቢ/ወረዳ ያስገቡ'}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Full Address' : 'ሙሉ አድራሻ'}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Enter full business address' : 'ሙሉ የንግድ አድራሻ ያስገቡ'}
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                {language === 'en' ? 'Services Offered' : 'የሚሰጡ አገልግሎቶች'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {serviceOptions.map(service => (
                  <label key={service} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="services"
                      value={service}
                      checked={formData.services.includes(service)}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {getServiceName(service)}
                    </span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Specialization' : 'ልዩ ችሎታ'}
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'en' ? 'e.g., Luxury properties, Commercial real estate' : 'ለምሳሌ፣ የቅንጦት ንብረቶች፣ የንግድ ሪል እስቴት'}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                {language === 'en' ? 'Additional Information' : 'ተጨማሪ መረጃ'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Website' : 'ድህረ ገጽ'}
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Social Media' : 'ማህበራዊ ሚዲያ'}
                  </label>
                  <input
                    type="text"
                    name="socialMedia"
                    value={formData.socialMedia}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={language === 'en' ? 'Facebook, Instagram, etc.' : 'ፌስቡክ፣ ኢንስታግራም፣ ወዘተ።'}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Business Description' : 'የንግድ መግለጫ'}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={language === 'en' 
                    ? 'Tell us about your business, experience, and what makes you unique...'
                    : 'ስለ ንግድዎ፣ ልምድዎ እና ልዩ የሚያደርግዎት ነገር ይንገሩን...'
                  }
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="text-sm text-gray-700">
                  {language === 'en' 
                    ? 'I agree to the Terms of Service and Privacy Policy. I understand that my application will be reviewed and I will be contacted within 2-3 business days.'
                    : 'የአገልግሎት ውሎችን እና የግላዊነት ፖሊሲን እስማማለሁ። ማመልከቻዬ እንደሚገመገም እና በ2-3 የስራ ቀናት ውስጥ እንደሚያገናኙኝ ተረድቻለሁ።'
                  }
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting || !formData.agreeToTerms}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isSubmitting 
                  ? (language === 'en' ? 'Submitting...' : 'በመላክ ላይ...')
                  : (language === 'en' ? 'Submit Application' : 'ማመልከቻ ላክ')
                }
              </button>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div className={`text-center p-4 rounded-lg ${
                submitMessage.includes('success') || submitMessage.includes('ተልኳል') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← {language === 'en' ? 'Back to Home' : 'ወደ ቤት ተመለስ'}
          </Link>
        </div>
      </div>
    </div>
  )
}