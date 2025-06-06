import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import './globals.css'
import SearchBar from '@/components/SearchBar'
import { ToastProvider } from '@/components/ui/Toast'
import SessionProvider from '@/components/SessionProvider'
import NavBar from '@/components/NavBar'

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
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <SessionProvider>
          <ToastProvider>
        <header className="global-nav">
          <NavBar />
        </header>
        <main className="global-main max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="global-footer bg-white mt-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              {new Date().getFullYear()} Standard Treatment Guidelines Wiki. All rights reserved.
            </p>
          </div>
        </footer>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
