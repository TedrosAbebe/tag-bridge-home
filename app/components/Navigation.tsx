'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

export default function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img src="/tagbridge-logo.svg" alt="Tag Bridge Home" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">
              Tag Bridge Home
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {t('home')}
            </Link>
            
            <Link
              href="/submit-property"
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === '/submit-property'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {language === 'en' ? 'List Property' : 'ንብረት ዝርዝር'}
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname === '/contact'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              {language === 'en' ? 'Contact' : 'ያነጋግሩን'}
            </Link>

            {/* Language Toggle */}
            <div className="border-l border-gray-200 pl-4">
              <LanguageToggle variant="compact" />
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.username} ({user.role})
                </span>
                
                {/* Role-based Links for logged in users */}
                {user.role === 'admin' && (
                  <Link
                    href="/admin-working"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/admin-working'
                        ? 'bg-red-600 text-white'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                
                {(user.role === 'admin' || user.role === 'broker') && (
                  <Link
                    href="/broker"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/broker'
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Broker
                  </Link>
                )}
                
                {(user.role === 'admin' || user.role === 'advertiser') && (
                  <Link
                    href="/advertiser"
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      pathname === '/advertiser'
                        ? 'bg-purple-600 text-white'
                        : 'text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    Advertiser
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/register-broker"
                  className="px-3 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors text-sm"
                >
                  {language === 'en' ? 'Register as Broker' : 'እንደ ደላላ ይመዝገቡ'}
                </Link>
                <Link
                  href="/register-advertiser"
                  className="px-3 py-2 rounded-lg border border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors text-sm"
                >
                  {language === 'en' ? 'Register as Advertiser' : 'እንደ አስተዋዋቂ ይመዝገቡ'}
                </Link>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  {t('login')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-green-600"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                {t('home')}
              </Link>
              <Link
                href="/submit-property"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                {language === 'en' ? 'List Property' : 'ንብረት ዝርዝር'}
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                {language === 'en' ? 'Contact' : 'ያነጋግሩን'}
              </Link>
              
              {/* Mobile Language Toggle */}
              <div className="px-3 py-2">
                <LanguageToggle variant="mobile" />
              </div>
              
              {user ? (
                <div className="pt-2 border-t border-gray-200">
                  <p className="px-3 py-2 text-sm text-gray-600">
                    {user.username} ({user.role})
                  </p>
                  
                  {user.role === 'admin' && (
                    <Link
                      href="/admin-working"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  {(user.role === 'admin' || user.role === 'broker') && (
                    <Link
                      href="/broker"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-blue-600 hover:bg-blue-50"
                    >
                      Broker Dashboard
                    </Link>
                  )}
                  
                  {(user.role === 'admin' || user.role === 'advertiser') && (
                    <Link
                      href="/advertiser"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-purple-600 hover:bg-purple-50"
                    >
                      Advertiser Dashboard
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <Link
                    href="/register-broker"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg border border-blue-600 text-blue-600 text-center hover:bg-blue-50"
                  >
                    {language === 'en' ? 'Register as Broker' : 'እንደ ደላላ ይመዝገቡ'}
                  </Link>
                  <Link
                    href="/register-advertiser"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg border border-purple-600 text-purple-600 text-center hover:bg-purple-50"
                  >
                    {language === 'en' ? 'Register as Advertiser' : 'እንደ አስተዋዋቂ ይመዝገቡ'}
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-green-600 text-white text-center"
                  >
                    {t('login')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}