'use client'

import { useLanguage } from '../contexts/LanguageContext'
import { LanguageIcon } from '@heroicons/react/24/outline'

interface LanguageToggleProps {
  variant?: 'default' | 'compact' | 'mobile' | 'admin'
  showIcon?: boolean
  showText?: boolean
}

export default function LanguageToggle({ 
  variant = 'default', 
  showIcon = true, 
  showText = true 
}: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en')
  }

  // Compact version for navigation
  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 group"
        title={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
      >
        {showIcon && <LanguageIcon className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />}
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
          {language === 'en' ? 'EN' : 'አማ'}
        </span>
        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
        <span className="text-xs text-gray-500 group-hover:text-gray-700">
          {language === 'en' ? 'አማ' : 'EN'}
        </span>
      </button>
    )
  }

  // Mobile version
  if (variant === 'mobile') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          {showIcon && <LanguageIcon className="w-5 h-5 text-gray-600" />}
          {showText && (
            <span className="text-sm font-medium text-gray-700">
              {language === 'en' ? 'Language: English' : 'ቋንቋ: አማርኛ'}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-blue-600">
            {language === 'en' ? 'EN' : 'አማ'}
          </span>
          <span className="text-sm text-gray-500">→</span>
          <span className="text-sm text-gray-500">
            {language === 'en' ? 'አማ' : 'EN'}
          </span>
        </div>
      </button>
    )
  }

  // Admin version
  if (variant === 'admin') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm group"
        title={language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
      >
        {showIcon && <LanguageIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-blue-600">
            {language === 'en' ? 'EN' : 'አማ'}
          </span>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500 group-hover:text-gray-700">
            {language === 'en' ? 'Switch to አማርኛ' : 'Switch to English'}
          </span>
        </div>
      </button>
    )
  }

  // Default animated toggle switch
  return (
    <button
      onClick={toggleLanguage}
      className="relative flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-full hover:shadow-md transition-all duration-300 group"
    >
      {showIcon && <LanguageIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />}
      
      {/* Animated background slider */}
      <div className="relative flex items-center bg-white rounded-full p-1 shadow-inner">
        <div 
          className={`absolute top-1 w-8 h-6 bg-gradient-to-r rounded-full shadow-sm transition-all duration-300 ${
            language === 'en' 
              ? 'left-1 from-blue-400 to-blue-500' 
              : 'left-9 from-green-400 to-green-500'
          }`}
        />
        
        <div className="relative flex items-center space-x-1">
          <span className={`px-2 py-1 text-sm font-bold transition-colors duration-300 ${
            language === 'en' ? 'text-white' : 'text-gray-600'
          }`}>
            EN
          </span>
          <span className={`px-2 py-1 text-sm font-bold transition-colors duration-300 ${
            language === 'am' ? 'text-white' : 'text-gray-600'
          }`}>
            አማ
          </span>
        </div>
      </div>
      
      {showText && (
        <span className="text-sm text-gray-600 group-hover:text-gray-800">
          {language === 'en' ? 'English' : 'አማርኛ'}
        </span>
      )}
    </button>
  )
}