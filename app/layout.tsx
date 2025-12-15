import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Navigation from './components/Navigation'

export const metadata = {
  title: 'Tag Bridge Home',
  description: 'Modern Home Buy & Sell Broker App for Ethiopia - የኢትዮጵያ የቤት ደላላ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Force CSS classes to be included */
            .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
            .from-green-600 { --tw-gradient-from: #16a34a; }
            .to-blue-600 { --tw-gradient-to: #2563eb; }
            .bg-ethiopian-green { background-color: #009639 !important; }
            .bg-ethiopian-blue { background-color: #0F4C75 !important; }
            .animate-bounce { animation: 1s infinite bounce; }
            .animate-pulse { animation: 2s cubic-bezier(.4,0,.6,1) infinite pulse; }
            @keyframes bounce { 0%, 100% { transform: translateY(-25%); } 50% { transform: none; } }
            @keyframes pulse { 50% { opacity: .5; } }
          `
        }} />
      </head>
      <body className="antialiased bg-gradient-to-r from-green-600 to-blue-600 bg-ethiopian-green animate-bounce animate-pulse">
        <LanguageProvider>
          <AuthProvider>
            <Navigation />
            <main className="pb-16 md:pb-0">
              {children}
            </main>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}