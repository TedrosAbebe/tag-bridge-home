'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterBrokerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Account & Access
    username: '',
    password: '',
    confirmPassword: '',
    
    // Personal Identification
    fullName: '',
    phone: '',
    email: '',
    nationalId: '',
    dateOfBirth: '',
    gender: '',
    
    // Business Information
    brokerType: '',
    businessName: '',
    businessAddress: '',
    city: '',
    area: '',
    yearsOfExperience: '',
    
    // Legal & Verification
    licenseNumber: '',
    
    // Legacy fields for compatibility
    experience: '',
    specialization: '',
    agreeToTerms: false
  })
  const [licenseFile, setLicenseFile] = useState<string | null>(null)
  const [licenseFileName, setLicenseFileName] = useState<string>('')
  const [idFile, setIdFile] = useState<string | null>(null)
  const [idFileName, setIdFileName] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (PDF, JPG, PNG)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, JPG, or PNG file for your license')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('License file must be less than 5MB')
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setLicenseFile(base64String)
        setLicenseFileName(file.name)
        setError('') // Clear any previous errors
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (PDF, JPG, PNG)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, JPG, or PNG file for your ID document')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ID document file must be less than 5MB')
        return
      }

      // Convert to base64
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setIdFile(base64String)
        setIdFileName(file.name)
        setError('') // Clear any previous errors
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLicenseFile = () => {
    setLicenseFile(null)
    setLicenseFileName('')
    // Reset the file input
    const fileInput = document.getElementById('licenseUpload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const removeIdFile = () => {
    setIdFile(null)
    setIdFileName('')
    // Reset the file input
    const fileInput = document.getElementById('idUpload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: 'broker',
          brokerInfo: {
            // Personal Identification
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            nationalId: formData.nationalId,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            
            // Business Information
            brokerType: formData.brokerType,
            businessName: formData.businessName,
            businessAddress: formData.businessAddress,
            city: formData.city,
            area: formData.area,
            yearsOfExperience: formData.yearsOfExperience,
            
            // Legal & Verification
            licenseNumber: formData.licenseNumber,
            
            // Legacy compatibility
            experience: formData.yearsOfExperience || formData.experience,
            specialization: formData.specialization,
            
            // Document uploads
            licenseFile: licenseFile,
            licenseFileName: licenseFileName,
            idFile: idFile,
            idFileName: idFileName
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Broker registration successful! Please wait for admin approval before you can access broker features.')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-4xl">🏢</span>
            </div>
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-lg">✨</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            Register as Professional Broker
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join Tag Bridge Home as a certified real estate professional and unlock premium features
          </p>
          <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-200/50 shadow-inner">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-3xl">🎯</span>
              <span className="font-bold text-blue-800 text-lg">Professional Broker Benefits</span>
            </div>
            <p className="text-sm text-blue-700">
              Advanced dashboard • Premium listings • Direct client contact • Professional verification
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10 form-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1️⃣ Personal Identification */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200/50 shadow-sm form-section mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">1️⃣</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Personal Identification</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-sm font-bold text-gray-800 mb-3">
                      Full Name *
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">👨‍💼</span>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                        placeholder="Your full legal name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-3">
                      Phone Number (Primary Contact) *
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">📱</span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                        placeholder="+251-911-123456"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-3">
                      Email Address
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">📧</span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                        placeholder="your.email@example.com (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="nationalId" className="block text-sm font-bold text-gray-800 mb-3">
                      National ID / Passport Number *
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🆔</span>
                      <input
                        type="text"
                        id="nationalId"
                        name="nationalId"
                        required
                        value={formData.nationalId}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                        placeholder="National ID or Passport number"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="block text-sm font-bold text-gray-800 mb-3">
                      Date of Birth *
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">📅</span>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="gender" className="block text-sm font-bold text-gray-800 mb-3">
                      Gender *
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">👥</span>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 hover:shadow-lg appearance-none"
                      >
                        <option value="">Select gender</option>
                        <option value="male">👨 Male</option>
                        <option value="female">👩 Female</option>
                        <option value="other">🏳️‍⚧️ Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2️⃣ Account & Access */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200/50 shadow-sm form-section mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">2️⃣</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Account & Access</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-bold text-gray-800 mb-3">
                    Username *
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔑</span>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                      placeholder="Choose a unique username"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-3">
                    Password *
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔒</span>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-800 mb-3">
                    Confirm Password *
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔐</span>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                      placeholder="Re-enter your password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200/50 shadow-sm form-section mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">📞</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-3">
                    Email Address *
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">📧</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-3">
                    Phone Number *
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">📱</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                      placeholder="+251-911-123456"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-200/50 shadow-sm form-section mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xl">🎓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="licenseNumber" className="block text-sm font-bold text-gray-800 mb-3">
                      License Number
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">📜</span>
                      <input
                        type="text"
                        id="licenseNumber"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 placeholder-gray-500 hover:shadow-lg"
                        placeholder="Real estate license number"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="experience" className="block text-sm font-bold text-gray-800 mb-3">
                      Years of Experience *
                    </label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">⏰</span>
                      <select
                        id="experience"
                        name="experience"
                        required
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 hover:shadow-lg appearance-none"
                      >
                        <option value="">Select experience level</option>
                        <option value="0-1">🌱 0-1 years (New to real estate)</option>
                        <option value="2-5">📈 2-5 years (Growing experience)</option>
                        <option value="6-10">🏆 6-10 years (Experienced professional)</option>
                        <option value="11-15">💎 11-15 years (Senior expert)</option>
                        <option value="15+">👑 15+ years (Industry veteran)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="specialization" className="block text-sm font-bold text-gray-800 mb-3">
                    Specialization *
                  </label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🎯</span>
                    <select
                      id="specialization"
                      name="specialization"
                      required
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white/70 backdrop-blur-sm text-gray-900 hover:shadow-lg appearance-none"
                    >
                      <option value="">Select your specialization</option>
                      <option value="residential">🏠 Residential Properties</option>
                      <option value="commercial">🏢 Commercial Properties</option>
                      <option value="land">🌍 Land Sales</option>
                      <option value="rental">🏠 Rental Properties</option>
                      <option value="luxury">💎 Luxury Properties</option>
                      <option value="all">🌟 All Property Types</option>
                    </select>
                  </div>
                </div>

                {/* License Upload Section */}
                <div className="space-y-2">
                  <label htmlFor="licenseUpload" className="block text-sm font-bold text-gray-800 mb-3">
                    Upload License Document (Optional)
                  </label>
                  <div className="space-y-4">
                    {!licenseFile ? (
                      <div className="relative group">
                        <div className="w-full border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center hover:border-purple-500 transition-all duration-300 bg-white/50 backdrop-blur-sm">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center">
                              <span className="text-white text-3xl">📄</span>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-700 mb-2">Upload Your License</p>
                              <p className="text-sm text-gray-500 mb-4">
                                PDF, JPG, or PNG files up to 5MB
                              </p>
                              <label
                                htmlFor="licenseUpload"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <span className="mr-2">📎</span>
                                Choose File
                              </label>
                              <input
                                type="file"
                                id="licenseUpload"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleLicenseUpload}
                                className="hidden"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                              <span className="text-white text-xl">✅</span>
                            </div>
                            <div>
                              <p className="font-semibold text-green-800">License Uploaded Successfully</p>
                              <p className="text-sm text-green-600 truncate max-w-xs">{licenseFileName}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeLicenseFile}
                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-blue-500 text-xl mt-0.5">💡</span>
                        <div>
                          <p className="text-sm text-blue-800 font-medium mb-1">License Upload Benefits:</p>
                          <ul className="text-xs text-blue-700 space-y-1">
                            <li>• Faster approval process</li>
                            <li>• Enhanced credibility with clients</li>
                            <li>• Priority listing features</li>
                            <li>• Professional verification badge</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-8 border border-amber-200/50 shadow-sm form-section mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-6 h-6 text-blue-600 focus:ring-blue-500 border-2 border-gray-300 rounded-lg transition-all duration-200"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">I agree to the </span>
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                      Terms and Conditions
                    </Link>
                    <span className="font-semibold text-gray-900"> and </span>
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium underline decoration-2 underline-offset-2">
                      Privacy Policy
                    </Link>
                    <span className="font-semibold text-gray-900">. I understand that my broker account will be reviewed by admin before activation.</span>
                  </label>
                  <div className="mt-3 p-3 bg-blue-100 rounded-xl border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800 font-medium">
                      📋 <strong>Review Process:</strong> Your application will be reviewed within 24-48 hours. You'll receive email notification once approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-6 mb-6 animate-shake">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl">⚠️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 mb-1">Registration Error</h4>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-6 mb-6 animate-bounce">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-2xl">✅</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-800 mb-1">Registration Successful!</h4>
                    <p className="text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 px-8 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 hover:from-blue-600 hover:via-purple-600 hover:to-green-600 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed transform-none animate-pulse' : ''
                }`}
              >
                <div className="flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Processing Registration...</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>Register as Professional Broker</span>
                      <span>✨</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl border border-blue-100 p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-4">
              Why Choose Tag Bridge Home?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join Ethiopia's leading real estate platform and unlock professional opportunities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Market Leader</h3>
              <p className="text-gray-600 leading-relaxed">
                Ethiopia's most trusted real estate platform with thousands of active users and verified properties.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Higher Earnings</h3>
              <p className="text-gray-600 leading-relaxed">
                Premium listing features and direct client connections help you close more deals and earn more.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Tools</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional dashboard, analytics, WhatsApp integration, and premium marketing features.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border border-blue-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">🌟 Exclusive Broker Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="text-gray-700 font-medium">Priority property placement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="text-gray-700 font-medium">Direct WhatsApp & phone integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="text-gray-700 font-medium">Professional verification badge</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="text-gray-700 font-medium">Advanced analytics & insights</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="text-gray-700 font-medium">Premium listing features</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-500 text-xl">✅</span>
                    <span className="text-gray-700 font-medium">24/7 admin support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}