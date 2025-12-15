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
      <body className="antialiased">
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