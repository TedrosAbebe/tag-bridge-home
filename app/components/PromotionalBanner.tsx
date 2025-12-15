'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

interface Banner {
  id: string
  title: { en: string; am: string }
  description: { en: string; am: string }
  buttonText: { en: string; am: string }
  buttonLink: string
  backgroundColor: string
  textColor: string
  icon: string
  type: 'promotion' | 'announcement' | 'feature'
}

export default function PromotionalBanner() {
  const { language } = useLanguage()
  const [banners, setBanners] = useState<Banner[]>([])
  const [closedBanners, setClosedBanners] = useState<string[]>([])
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners')
        const data = await response.json()
        
        if (data.success) {
          setBanners(data.banners)
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Load closed banners from localStorage
  useEffect(() => {
    const closed = localStorage.getItem('closedBanners')
    if (closed) {
      setClosedBanners(JSON.parse(closed))
    }
  }, [])

  // Auto-rotate banners every 10 seconds
  useEffect(() => {
    const availableBanners = banners.filter(banner => !closedBanners.includes(banner.id))
    if (availableBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % availableBanners.length)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [closedBanners, banners])

  const closeBanner = (bannerId: string) => {
    const newClosedBanners = [...closedBanners, bannerId]
    setClosedBanners(newClosedBanners)
    localStorage.setItem('closedBanners', JSON.stringify(newClosedBanners))
    
    // Reset current index if needed
    const availableBanners = banners.filter(banner => !newClosedBanners.includes(banner.id))
    if (currentBannerIndex >= availableBanners.length) {
      setCurrentBannerIndex(0)
    }
  }

  const availableBanners = banners.filter(banner => !closedBanners.includes(banner.id))
  
  if (loading) {
    return null // Don't show anything while loading
  }
  
  if (availableBanners.length === 0) {
    return null
  }

  const currentBanner = availableBanners[currentBannerIndex]

  return (
    <div className={`relative bg-gradient-to-r ${currentBanner.backgroundColor} ${currentBanner.textColor} py-4 px-6 mx-4 my-6 rounded-2xl shadow-lg animate-slideUp`}>
      {/* Close Button */}
      <button
        onClick={() => closeBanner(currentBanner.id)}
        className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        aria-label="Close banner"
      >
        <span className="text-white font-bold text-lg">×</span>
      </button>

      <div className="flex items-center justify-between pr-10">
        <div className="flex items-center space-x-4">
          <div className="text-4xl animate-bounce">
            {currentBanner.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">
              {currentBanner.title[language]}
            </h3>
            <p className="text-sm opacity-90">
              {currentBanner.description[language]}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Banner Navigation Dots */}
          {availableBanners.length > 1 && (
            <div className="flex space-x-2">
              {availableBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentBannerIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Action Button */}
          <a
            href={currentBanner.buttonLink}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-white/30"
          >
            {currentBanner.buttonText[language]}
          </a>
        </div>
      </div>

      {/* Progress Bar for Auto-rotation */}
      {availableBanners.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 rounded-b-2xl overflow-hidden">
          <div 
            className="h-full bg-white/50 animate-progress"
            style={{
              animation: 'progress 10s linear infinite'
            }}
          />
        </div>
      )}
    </div>
  )
}