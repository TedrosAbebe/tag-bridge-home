'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function TestImagesPage() {
  const [imageStatuses, setImageStatuses] = useState<{[key: string]: string}>({})

  const testImages = [
    { name: 'Test House 1', url: '/uploads/test-house-1.svg' },
    { name: 'Test House 2', url: '/uploads/test-house-2.svg' },
    { name: 'Test House 3', url: '/uploads/test-house-3.svg' },
    { name: 'Premium Property', url: '/uploads/premium-property.svg' }
  ]

  const handleImageLoad = (imageName: string) => {
    setImageStatuses(prev => ({ ...prev, [imageName]: 'success' }))
    console.log(`✅ ${imageName} loaded successfully`)
  }

  const handleImageError = (imageName: string) => {
    setImageStatuses(prev => ({ ...prev, [imageName]: 'error' }))
    console.error(`❌ ${imageName} failed to load`)
  }

  useEffect(() => {
    console.log('🖼️ Testing image accessibility...')
    
    // Test direct fetch to images
    testImages.forEach(async (img) => {
      try {
        const response = await fetch(img.url)
        if (response.ok) {
          console.log(`✅ ${img.url} is accessible (${response.status})`)
        } else {
          console.error(`❌ ${img.url} returned ${response.status}`)
        }
      } catch (error) {
        console.error(`❌ ${img.url} fetch failed:`, error)
      }
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">🖼️ Image Files Test</h1>
          <p className="text-center text-gray-600 mb-8">
            Testing if the generated image files are accessible and displaying correctly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {testImages.map((img, index) => (
              <div 
                key={index} 
                className={`border-2 rounded-lg p-4 text-center transition-all ${
                  imageStatuses[img.name] === 'success' 
                    ? 'border-green-500 bg-green-50' 
                    : imageStatuses[img.name] === 'error'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200'
                }`}
              >
                <h3 className="font-semibold mb-4">{img.name}</h3>
                
                <div className="relative w-full h-48 mb-4 bg-gray-100 rounded border">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover rounded"
                    onLoad={() => handleImageLoad(img.name)}
                    onError={() => handleImageError(img.name)}
                  />
                </div>
                
                <p className={`text-sm font-medium ${
                  imageStatuses[img.name] === 'success' 
                    ? 'text-green-600' 
                    : imageStatuses[img.name] === 'error'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}>
                  {imageStatuses[img.name] === 'success' 
                    ? '✅ Loaded successfully' 
                    : imageStatuses[img.name] === 'error'
                    ? '❌ Failed to load'
                    : '⏳ Loading...'}
                </p>
                
                <p className="text-xs text-gray-500 mt-2 break-all">
                  {img.url}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">🎯 Next Steps</h3>
            <p className="text-gray-600">
              If all images loaded successfully above, they should now appear on the homepage!
            </p>
            
            <div className="space-x-4">
              <a 
                href="/" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                🏡 Open Homepage
              </a>
              <a 
                href="/property/test-prop-with-images-1765709610848" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🏠 View Test Property
              </a>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-4">📋 What Changed:</h4>
            <ul className="space-y-2 text-sm">
              <li>✅ Replaced base64 images with actual SVG files</li>
              <li>✅ Created /public/uploads/ directory</li>
              <li>✅ Generated 4 beautiful house images</li>
              <li>✅ Updated database to use file URLs</li>
              <li>✅ Updated Next.js config for local images</li>
            </ul>
          </div>

          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-2">🔍 Debug Info:</h4>
            <p className="text-sm text-gray-700">
              Check the browser console for detailed loading information.
              Images should be accessible at /uploads/filename.svg
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}