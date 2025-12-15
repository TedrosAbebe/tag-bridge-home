'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Search' },
    { href: '/favorites', label: 'Favorites' },
    { href: '/profile', label: 'Profile' },
  ]

  const guestNavItems = [
    { href: '/', label: 'Home' },
    { href: '/search', label: 'Search' },
    { href: '/submit-property', label: 'List Property' },
  ]

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🏠</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Ethiopia Home Broker
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {(user ? navItems : guestNavItems).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Admin Dashboard Link */}
            {user?.role === 'admin' && (
              <Link
                href="/admin-working"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/admin-working'
                    ? 'bg-red-600 text-white'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <span>Admin</span>
              </Link>
            )}
            
            {/* Broker Dashboard Link */}
            {user && (user.role === 'admin' || user.role === 'broker') && (
              <Link
                href="/broker"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  pathname === '/broker'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>Broker</span>
              </Link>
            )}
            
            {/* Add Listing Link */}
            {(user?.role === 'broker' || user?.role === 'admin') && (
              <Link
                href="/broker/add-listing"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-1"
              >
                <span>➕</span>
                <span>Add Listing</span>
              </Link>
            )}

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.username} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
              >
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🏠</span>
            </div>
            <span className="text-lg font-bold text-gray-900">
              Home Broker
            </span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-green-600"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white">
            <div className="px-4 py-2 space-y-1">
              {(user ? navItems : guestNavItems).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Admin Dashboard Link - Mobile */}
              {user?.role === 'admin' && (
                <Link
                  href="/admin-working"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    pathname === '/admin-working'
                      ? 'bg-red-600 text-white'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <span>Admin Dashboard</span>
                </Link>
              )}
              
              {/* Broker Dashboard Link - Mobile */}
              {user && (user.role === 'admin' || user.role === 'broker') && (
                <Link
                  href="/broker"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    pathname === '/broker'
                      ? 'bg-blue-600 text-white'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <span>Broker Dashboard</span>
                </Link>
              )}
              
              {/* Add Listing Link - Mobile */}
              {(user?.role === 'broker' || user?.role === 'admin') && (
                <Link
                  href="/broker/add-listing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-green-600 text-white"
                >
                  <span>➕ Add Listing</span>
                </Link>
              )}
              
              {/* Auth Actions - Mobile */}
              {user ? (
                <div className="px-3 py-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Welcome, {user.username} ({user.role})
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                >
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around py-2">
          {(user ? navItems : guestNavItems).slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
            >
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}