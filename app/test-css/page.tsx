export default function TestCSS() {
  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(to right, #16a34a, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: 'white', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxWidth: '28rem'}}>
        <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem'}}>
          🎨 CSS Test Page
        </h1>
        <p style={{color: '#4b5563', marginBottom: '1.5rem'}}>
          Testing both inline styles and Tailwind classes
        </p>
        
        <div className="space-y-4">
          <div className="bg-red-500 text-white p-4 rounded-lg">
            Tailwind: Red Background
          </div>
          
          <div className="bg-ethiopian-green text-white p-4 rounded-lg">
            Custom: Ethiopian Green
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
            Tailwind: Gradient Background
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="h-16 bg-red-500 rounded animate-bounce"></div>
            <div className="h-16 bg-yellow-500 rounded animate-spin"></div>
            <div className="h-16 bg-blue-500 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          If you see colors and animations above, Tailwind is working!
        </div>
      </div>
    </div>
  )
}