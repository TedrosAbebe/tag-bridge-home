'use client'

import { useEffect, useState } from 'react'

export default function DebugCSS() {
  const [cssLoaded, setCssLoaded] = useState(false)
  const [tailwindWorking, setTailwindWorking] = useState(false)

  useEffect(() => {
    // Check if CSS is loaded
    const checkCSS = () => {
      const testElement = document.createElement('div')
      testElement.className = 'bg-red-500'
      testElement.style.display = 'none'
      document.body.appendChild(testElement)
      
      const computedStyle = window.getComputedStyle(testElement)
      const backgroundColor = computedStyle.backgroundColor
      
      document.body.removeChild(testElement)
      
      // If Tailwind is working, bg-red-500 should set background-color
      if (backgroundColor === 'rgb(239, 68, 68)' || backgroundColor.includes('239')) {
        setTailwindWorking(true)
      }
      
      setCssLoaded(true)
    }

    // Wait a bit for CSS to load
    setTimeout(checkCSS, 1000)
  }, [])

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🔍 CSS Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Tailwind Test */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Basic Tailwind Test</h2>
            <div className="space-y-4">
              <div className="w-full h-8 bg-red-500 rounded">Red Background</div>
              <div className="w-full h-8 bg-blue-500 rounded">Blue Background</div>
              <div className="w-full h-8 bg-green-500 rounded">Green Background</div>
            </div>
            <p className="mt-4 text-sm">
              Status: {tailwindWorking ? '✅ Working' : '❌ Not Working'}
            </p>
          </div>

          {/* Gradient Test */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Gradient Test</h2>
            <div className="space-y-4">
              <div className="w-full h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded">
                Purple to Pink
              </div>
              <div className="w-full h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded">
                Green to Blue
              </div>
            </div>
          </div>

          {/* Animation Test */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Animation Test</h2>
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-red-500 rounded animate-bounce">Bounce</div>
              <div className="w-16 h-16 bg-blue-500 rounded animate-spin">Spin</div>
              <div className="w-16 h-16 bg-green-500 rounded animate-pulse">Pulse</div>
            </div>
          </div>

          {/* Ethiopian Colors Test */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Ethiopian Colors</h2>
            <div className="space-y-2">
              <div className="w-full h-8 bg-ethiopian-green rounded text-white flex items-center justify-center">
                Ethiopian Green
              </div>
              <div className="w-full h-8 bg-ethiopian-blue rounded text-white flex items-center justify-center">
                Ethiopian Blue
              </div>
            </div>
          </div>
        </div>

        {/* CSS Loading Status */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">CSS Loading Status</h2>
          <div className="space-y-2">
            <p>CSS Check Complete: {cssLoaded ? '✅' : '⏳'}</p>
            <p>Tailwind Working: {tailwindWorking ? '✅' : '❌'}</p>
            <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</p>
          </div>
          
          {!tailwindWorking && cssLoaded && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
              <h3 className="font-bold text-red-800">CSS Not Loading!</h3>
              <p className="text-red-700">Tailwind CSS classes are not being applied. Check:</p>
              <ul className="list-disc list-inside text-red-700 mt-2">
                <li>Browser console for errors</li>
                <li>Network tab for CSS file loading</li>
                <li>Tailwind config and globals.css</li>
              </ul>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Debug Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open browser DevTools (F12)</li>
            <li>Check Console tab for any errors</li>
            <li>Check Network tab - look for CSS files loading</li>
            <li>If colors above don't show, Tailwind isn't loading</li>
            <li>Try hard refresh (Ctrl+F5)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}