import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import './globals.css'
import SearchBar from '@/components/SearchBar'
import { ToastProvider } from '@/components/ui/Toast'
import SessionProvider from '@/components/SessionProvider'
import NavBar from '@/components/NavBar'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Standard Treatment Guidelines',
  description: 'A comprehensive wiki for medical treatment guidelines',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
        <SessionProvider>
          <ToastProvider>
        <header className="global-nav">
          <NavBar />
        </header>
        <main className="global-main max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="global-footer bg-white dark:bg-gray-800 mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {new Date().getFullYear()} Standard Treatment Guidelines Wiki. All rights reserved.
            </p>
          </div>
        </footer>
        
        <Script id="color-scheme-script" strategy="beforeInteractive">
          {`
            (function() {
              // Check if user prefers dark mode
              const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
              
              // Apply the appropriate class to the html element
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
              
              // Listen for changes in color scheme preference
              window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(e.matches ? 'dark' : 'light');
              });
            })();
          `}
        </Script>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
