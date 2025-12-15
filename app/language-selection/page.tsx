'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  LanguageIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function LanguageSelectionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { language, setLanguage } = useLanguage()
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'am'>('en')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push('/login')
      return
    }

    // Set initial language based on current context
    setSelectedLanguage(language)
  }, [user, language, router])

  const handleLanguageSelect = (lang: 'en' | 'am') => {
    setSelectedLanguage(lang)
  }

  const handleContinue = () => {
    setIsAnimating(true)
    setLanguage(selectedLanguage)
    
    // Store language preference in localStorage
    localStorage.setItem('preferred-language', selectedLanguage)
    
    // Redirect based on user role after a short delay for animation
    setTimeout(() => {
      if (user?.role === 'admin') {
        router.push('/admin-working')
      } else if (user?.role === 'broker') {
        router.push('/broker')
      } else {
        router.push('/dashboard')
      }
    }, 800)
  }

  const handleSkip = () => {
    // Use current language and continue
    if (user?.role === 'admin') {
      router.push('/admin-working')
    } else if (user?.role === 'broker') {
      router.push('/broker')
    } else {
      router.push('/dashboard')
    }
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-6 shadow-lg">
            <GlobeAltIcon className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Ethiopia Home Broker!
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            እንኳን ወደ ኢትዮጵያ ሆም ብሮከር በደህና መጡ!
          </h2>
          
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Choose your preferred language to get started with the best experience tailored for you.
          </p>
          <p className="text-lg text-gray-600 max-w-lg mx-auto mt-2">
            የእርስዎን ተመራጭ ቋንቋ ይምረጡ እና ለእርስዎ የተዘጋጀ ምርጥ ተሞክሮ ይጀምሩ።
          </p>
        </div>

        {/* Language Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* English Option */}
          <div
            onClick={() => handleLanguageSelect('en')}
            className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              selectedLanguage === 'en' 
                ? 'ring-4 ring-blue-500 shadow-2xl' 
                : 'hover:shadow-xl'
            }`}
          >
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 h-full">
              {selectedLanguage === 'en' && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">EN</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">English</h3>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">International standard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Global business language</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Wide accessibility</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    Perfect for international users and business operations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Amharic Option */}
          <div
            onClick={() => handleLanguageSelect('am')}
            className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              selectedLanguage === 'am' 
                ? 'ring-4 ring-green-500 shadow-2xl' 
                : 'hover:shadow-xl'
            }`}
          >
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 h-full">
              {selectedLanguage === 'am' && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">አማ</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-1">አማርኛ</h3>
                <p className="text-lg text-gray-600 mb-3">Amharic</p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">የአገር ቋንቋ</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">ባህላዊ ተገቢነት</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">ቀላል አጠቃቀም</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    ለኢትዮጵያውያን ተጠቃሚዎች ምርጥ ተሞክሮ
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Best experience for Ethiopian users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleContinue}
            disabled={isAnimating}
            className={`flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
              selectedLanguage === 'en'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            } ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAnimating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                {selectedLanguage === 'en' ? 'Setting up...' : 'በማዘጋጀት ላይ...'}
              </>
            ) : (
              <>
                <LanguageIcon className="w-5 h-5 mr-3" />
                {selectedLanguage === 'en' ? 'Continue in English' : 'በአማርኛ ይቀጥሉ'}
                <ArrowRightIcon className="w-5 h-5 ml-3" />
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
          >
            Skip for now
          </button>
        </div>

        {/* User Info */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-md">
            <div className={`w-3 h-3 rounded-full mr-3 ${
              user.role === 'admin' ? 'bg-red-500' :
              user.role === 'broker' ? 'bg-blue-500' : 'bg-green-500'
            }`}></div>
            <span className="text-sm text-gray-700">
              Logged in as <strong>{user.username}</strong> ({user.role})
            </span>
          </div>
        </div>

        {/* Language Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2">🌍 Global Reach</h4>
            <p className="text-sm text-gray-600">
              English interface connects you with international markets and partners
            </p>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-2">🏠 Local Connection</h4>
            <p className="text-sm text-gray-600">
              አማርኛ በአገር ውስጥ ደንበኞች እና ሽርክናዎች ጋር ጠንካራ ግንኙነት ይፈጥራል
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 You can change your language preference anytime from the dashboard settings
          </p>
          <p className="text-sm text-gray-500 mt-1">
            ቋንቋዎን በማንኛውም ጊዜ ከዳሽቦርድ ቅንብሮች መቀየር ይችላሉ
          </p>
        </div>
      </div>
    </div>
  )
}