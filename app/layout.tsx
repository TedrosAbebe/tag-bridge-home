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
            /* Ensure critical CSS classes are available */
            .bg-ethiopian-green { background-color: #009639 !important; }
            .bg-ethiopian-blue { background-color: #0F4C75 !important; }
            .bg-ethiopian-yellow { background-color: #FFCD00 !important; }
            .bg-ethiopian-red { background-color: #DA020E !important; }
          `
        }} />
      </head>
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